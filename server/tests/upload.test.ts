import request from 'supertest';
import app from '../src/app';
import { testPool } from './setup';
import path from 'path';

describe('Upload Endpoints', () => {
  let authToken: string;

  beforeAll(async () => {
    // Create test user and get auth token
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'Test123!@#',
      name: 'Test User',
    });

    authToken = res.body.token;
  });

  describe('POST /api/uploads', () => {
    it('should upload images', async () => {
      const res = await request(app)
        .post('/api/uploads')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('images', path.resolve(__dirname, './fixtures/test-image.jpg'))
        .attach(
          'images',
          path.resolve(__dirname, './fixtures/test-image2.jpg'),
        );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('urls');
      expect(Array.isArray(res.body.urls)).toBeTruthy();
      expect(res.body.urls.length).toBe(2);
    });

    it('should not upload more than 4 images', async () => {
      const res = await request(app)
        .post('/api/uploads')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('images', path.resolve(__dirname, './fixtures/test-image.jpg'))
        .attach('images', path.resolve(__dirname, './fixtures/test-image2.jpg'))
        .attach('images', path.resolve(__dirname, './fixtures/test-image3.jpg'))
        .attach('images', path.resolve(__dirname, './fixtures/test-image4.jpg'))
        .attach(
          'images',
          path.resolve(__dirname, './fixtures/test-image5.jpg'),
        );

      expect(res.status).toBe(400);
    });

    it('should validate image type', async () => {
      const res = await request(app)
        .post('/api/uploads')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('images', path.resolve(__dirname, './fixtures/test-file.txt'));

      expect(res.status).toBe(400);
    });
  });
});
