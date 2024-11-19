import { testPool } from '../setup';

export async function createTestUser(
  email = 'test@example.com',
  password = 'hashedPassword',
  name = 'Test User',
) {
  const {
    rows: [user],
  } = await testPool.query(
    `INSERT INTO users (email, password, name)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [email, password, name],
  );
  return user;
}

export async function createTestPost(
  content: string,
  authorId: string,
  mediaUrls: string[] = [],
) {
  const {
    rows: [post],
  } = await testPool.query(
    `INSERT INTO posts (content, author_id, media_urls)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [content, authorId, mediaUrls],
  );
  return post;
}
