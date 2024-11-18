import { DatabaseError } from 'pg';
import pool from '../config/postgres';
import { DbError } from '../utils/dbErrors';

interface Like {
  user_id: string;
  post_id: string;
  created_at: Date;
}

export const likeRepo = {
  like: async (userId: string, postId: string): Promise<boolean> => {
    try {
      await pool.query('BEGIN');

      // Check if post exists
      const postExists = await pool.query(
        'SELECT id FROM posts WHERE id = $1',
        [postId],
      );
      if (postExists.rowCount === 0) {
        throw new DbError('Post not found', 404);
      }

      // Check if already liked
      const alreadyLiked = await pool.query(
        'SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId],
      );
      if (alreadyLiked.rowCount && alreadyLiked.rowCount > 0) {
        throw new DbError('Already liked', 400);
      }

      // Insert like
      const sql = `
          INSERT INTO likes (user_id, post_id)
          VALUES ($1, $2)
        `;
      await pool.query(sql, [userId, postId]);

      // Increment post likes_count
      const updateSql = `
          UPDATE posts
          SET likes_count = likes_count + 1
          WHERE id = $1
        `;
      await pool.query(updateSql, [postId]);

      await pool.query('COMMIT');
      return true;
    } catch (error) {
      await pool.query('ROLLBACK');
      if (error instanceof DbError) throw error;
      if (error instanceof DatabaseError) {
        if (error.code === '23505') {
          // unique_violation
          throw new DbError('Already liked', 400);
        }
        if (error.code === '23503') {
          // foreign_key_violation
          throw new DbError('User or post not found', 404);
        }
      }
      throw error;
    }
  },

  unlike: async (userId: string, postId: string): Promise<boolean> => {
    try {
      await pool.query('BEGIN');

      const sql = `
          DELETE FROM likes
          WHERE user_id = $1 AND post_id = $2
          RETURNING 1
        `;
      const result = await pool.query(sql, [userId, postId]);

      if (result.rowCount === 0) {
        throw new DbError('Like not found', 404);
      }

      const updateSql = `
          UPDATE posts
          SET likes_count = likes_count - 1
          WHERE id = $1
        `;
      await pool.query(updateSql, [postId]);

      await pool.query('COMMIT');
      return true;
    } catch (error) {
      await pool.query('ROLLBACK');
      if (error instanceof DbError) throw error;
      throw error;
    }
  },

  hasLiked: async (userId: string, postId: string): Promise<boolean> => {
    try {
      const sql = `
          SELECT EXISTS (
            SELECT 1 FROM likes
            WHERE user_id = $1 AND post_id = $2
          )
        `;
      const result = await pool.query(sql, [userId, postId]);
      return result.rows[0].exists;
    } catch (error) {
      throw error;
    }
  },
};
