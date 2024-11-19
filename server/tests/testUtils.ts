import { testPool } from './setup';
import request from 'supertest';
import app from '../src/app';

export async function createTestUser() {
  const user = {
    email: `test-${Date.now()}@example.com`,
    password: 'Test123!@#',
    name: 'Test User',
  };

  const response = await request(app).post('/api/auth/register').send(user);

  return {
    user,
    token: response.body.token,
    userId: response.body.user.id,
  };
}

export async function createTestPost(token: string, content = 'Test post') {
  const response = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({ content });

  return response.body;
}

export async function cleanDatabase() {
  await testPool.query('DELETE FROM likes');
  await testPool.query('DELETE FROM posts');
  await testPool.query('DELETE FROM users');
}
