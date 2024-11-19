import request from 'supertest';
import app from '../src/app';
import { testPool } from './setup';

describe('Posts Endpoints', () => {
  let authToken: string;
  let userId: string;
  let postId: string;

  const testUser = {
    email: 'test@example.com',
    password: 'Test123!@#',
    name: 'Test User',
  };

  const testPost = {
    content: 'Test post content',
    mediaUrls: ['https://example.com/image.jpg'],
  };

  beforeAll(async () => {
    // Create test user and get auth token
    const res = await request(app).post('/api/auth/register').send(testUser);

    authToken = res.body.token;
    userId = res.body.user.id;
  });

  beforeEach(async () => {
    await testPool.query('DELETE FROM posts');
    await testPool.query('DELETE FROM likes');
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testPost);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.content).toBe(testPost.content);
      postId = res.body.id;
    });

    it('should not create post without auth', async () => {
      const res = await request(app).post('/api/posts').send(testPost);

      expect(res.status).toBe(401);
    });

    it('should validate post content', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: '' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/posts', () => {
    beforeEach(async () => {
      // Create test post
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testPost);
      postId = res.body.id;
    });

    it('should get posts list', async () => {
      const res = await request(app).get('/api/posts');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0]).toHaveProperty('id');
    });

    it('should get posts with pagination', async () => {
      const res = await request(app)
        .get('/api/posts')
        .query({ page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should search posts', async () => {
      const res = await request(app)
        .get('/api/posts/search')
        .query({ q: 'test' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('POST /api/posts/:id/like', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testPost);
      postId = res.body.id;
    });

    it('should like a post', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Post liked successfully');
    });

    it('should not like same post twice', async () => {
      await request(app)
        .post(`/api/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      const res = await request(app)
        .post(`/api/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/posts/:id/like', () => {
    beforeEach(async () => {
      const postRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testPost);
      postId = postRes.body.id;

      await request(app)
        .post(`/api/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);
    });

    it('should unlike a post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Post unliked successfully');
    });
  });

  describe('POST /api/posts/:id/view', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testPost);
      postId = res.body.id;
    });

    it('should increment view count', async () => {
      const res = await request(app)
        .post(`/api/posts/${postId}/view`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('views');
      expect(res.body.views).toBe(1);
    });
  });
});
