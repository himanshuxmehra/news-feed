import { postRepo } from '@/repositories/post.repo';
import { userRepo } from '@/repositories/user.repo';
import { testPool } from '../../setup';
import { CustomError } from '@/utils/errors';

describe('PostRepository', () => {
  let userId: string;

  beforeEach(async () => {
    await testPool.query('DELETE FROM posts');
    await testPool.query('DELETE FROM users');

    const user = await userRepo.create(
      'test@example.com',
      'hashedPassword',
      'Test User',
    );
    userId = user.id;
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const post = await postRepo.create('Test content', userId, [
        'http://example.com/image.jpg',
      ]);

      expect(post).toHaveProperty('id');
      expect(post.content).toBe('Test content');
      expect(post.author_id).toBe(userId);
    });

    it('should create a reply to a post', async () => {
      const parentPost = await postRepo.create('Parent post', userId);
      const reply = await postRepo.create(
        'Reply content',
        userId,
        [],
        parentPost.id,
      );

      expect(reply.parent_post_id).toBe(parentPost.id);
    });

    it('should throw error for non-existent parent post', async () => {
      await expect(
        postRepo.create('Content', userId, [], 'non-existent-id'),
      ).rejects.toThrow(CustomError);
    });
  });

  describe('findPosts', () => {
    beforeEach(async () => {
      // Create test posts
      await postRepo.create('Post 1', userId);
      await postRepo.create('Post 2', userId);
      await postRepo.create('Post 3', userId);
    });

    it('should find all posts with default sorting', async () => {
      const posts = await postRepo.findPosts();
      expect(posts).toHaveLength(3);
      expect(posts[0].content).toBe('Post 3'); // Latest first
    });

    it('should sort posts by likes', async () => {
      const posts = await postRepo.findPosts('likes', 'desc');
      expect(posts).toHaveLength(3);
    });

    it('should paginate results', async () => {
      const posts = await postRepo.findPosts('date', 'desc', 2, 1);
      expect(posts).toHaveLength(2);
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await postRepo.create('Test post about cats', userId);
      await postRepo.create('Another post about dogs', userId);
      await postRepo.create('Random content', userId);
    });

    it('should search posts by content', async () => {
      const posts = await postRepo.search('cats');
      expect(posts).toHaveLength(1);
      expect(posts[0].content).toContain('cats');
    });

    it('should sort search results by relevance', async () => {
      const posts = await postRepo.search('post', 'relevance');
      expect(posts).toHaveLength(2);
    });
  });
});
