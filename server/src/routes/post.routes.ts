import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { asyncMiddleware } from '../middlewares/async.middleware';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  searchPosts,
  likePost,
  unlikePost,
} from '../controllers/post.controller';
import { rateLimiter } from '../middlewares/rate.middleware';

const router = Router();

// Public routes
router.get('/', asyncMiddleware(getPosts));
router.get('/search', asyncMiddleware(searchPosts));
router.get('/:id', asyncMiddleware(getPost));

// Protected routes
router.use(authenticate);

// Apply rate limiting to post creation and interactions
router.post('/', rateLimiter, asyncMiddleware(createPost));
router.put('/:id', rateLimiter, asyncMiddleware(updatePost));
router.delete('/:id', asyncMiddleware(deletePost));

// Like/Unlike with rate limiting
router.post('/:id/like', rateLimiter, asyncMiddleware(likePost));
router.delete('/:id/like', rateLimiter, asyncMiddleware(unlikePost));

export default router;
