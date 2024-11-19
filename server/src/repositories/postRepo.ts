import { DatabaseError } from 'pg';
import pool from '../config/postgres';
import { DbError } from '../utils/dbErrors';

interface Post {
  id: string;
  content: string;
  author_id: string;
  parent_post_id: string | null;
  likes_count: number;
  views_count: number;
  media_urls: string[];
  created_at: Date;
  updated_at: Date;
}

export const postRepo = {
  create: async (
    content: string,
    authorId: string,
    mediaUrls?: string[],
    parentPostId?: string,
  ): Promise<Post> => {
    try {
      const sql = `
        INSERT INTO posts (content, author_id, media_urls, parent_post_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result = await pool.query<Post>(sql, [
        content,
        authorId,
        mediaUrls,
        parentPostId,
      ]);
      return result.rows[0];
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === '23503') {
          // foreign_key_violation
          throw new DbError('User not found', 404);
        }
      }
      throw error;
    }
  },

  findById: async (id: string): Promise<Post | null> => {
    try {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const incrementViewsSql = `
          UPDATE posts 
          SET views_count = views_count + 1
          WHERE id = $1
        `;
        await client.query(incrementViewsSql, [id]);

        const sql = `
          SELECT p.id, p.content, p.author_id, p.parent_post_id, p.likes_count, p.views_count, p.media_urls, p.created_at, p.updated_at, u.name 
          FROM posts p 
          INNER JOIN users u ON p.author_id = u.id 
          WHERE p.id = $1
        `;
        const result = await client.query<Post>(sql, [id]);

        await client.query('COMMIT');

        if (!result.rows[0]) {
          throw new DbError('Post not found', 404);
        }
        return result.rows[0];
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      if (error instanceof DbError) throw error;
      throw error;
    }
  },

  findPosts: async (
    sort = 'date',
    order = 'desc',
    limit = 20,
    page = 1,
  ): Promise<Post[]> => {
    try {
      const validSortOptions = ['date', 'likes', 'replies'];
      if (!validSortOptions.includes(sort)) {
        throw new DbError('Invalid sort option', 400);
      }

      const offset = (page - 1) * limit;
      const sql = `
         SELECT p.id, p.content, p.author_id, p.parent_post_id, p.likes_count, p.views_count, p.media_urls, p.created_at, p.updated_at, u.name 
          FROM posts p 
          INNER JOIN users u ON p.author_id = u.id 
        WHERE p.parent_post_id IS NULL
        ORDER BY 
          CASE 
            WHEN $1 = 'date' THEN EXTRACT(EPOCH FROM p.created_at)
            WHEN $1 = 'likes' THEN p.likes_count
            WHEN $1 = 'replies' THEN (
              SELECT COUNT(*) FROM posts p2 
              WHERE p2.parent_post_id = p.id
            )
          END ${order}
        LIMIT $2 OFFSET $3
      `;
      const result = await pool.query<Post>(sql, [sort, limit, offset]);
      return result.rows;
    } catch (error) {
      if (error instanceof DbError) throw error;
      throw error;
    }
  },

  search: async (
    query: string,
    sort = 'relevance',
    order = 'desc',
    limit = 20,
    page = 1,
  ): Promise<Post[]> => {
    try {
      const validSortOptions = ['relevance', 'date', 'likes'];
      if (!validSortOptions.includes(sort)) {
        throw new DbError('Invalid sort option', 400);
      }

      const offset = (page - 1) * limit;
      const sql = `
          SELECT *, 
            ts_rank(search_vector, to_tsquery($1)) as rank
          FROM posts
          WHERE search_vector @@ to_tsquery($1)
          ORDER BY
            CASE 
              WHEN $2 = 'relevance' THEN ts_rank(search_vector, to_tsquery($1))
              WHEN $2 = 'date' THEN created_at
              WHEN $2 = 'likes' THEN likes_count
            END ${order}
          LIMIT $3 OFFSET $4
        `;
      const result = await pool.query<Post>(sql, [query, sort, limit, offset]);
      return result.rows;
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === '42601') {
          // syntax_error
          throw new DbError('Invalid search query', 400);
        }
      }
      throw error;
    }
  },

  update: async (
    id: string,
    content: string,
    mediaUrls?: string[],
  ): Promise<Post> => {
    try {
      const sql = `
          UPDATE posts 
          SET content = $2, media_urls = $3, updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
          RETURNING *
        `;
      const result = await pool.query<Post>(sql, [id, content, mediaUrls]);
      if (!result.rows[0]) {
        throw new DbError('Post not found', 404);
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof DbError) throw error;
      throw error;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const sql = 'DELETE FROM posts WHERE id = $1 RETURNING id';
      const result = await pool.query(sql, [id]);
      if (result.rowCount === 0) {
        throw new DbError('Post not found', 404);
      }
      return true;
    } catch (error) {
      if (error instanceof DbError) throw error;
      throw error;
    }
  },
};
