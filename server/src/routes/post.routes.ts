import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { asyncMiddleware } from '../middlewares/async.middleware';
import { validate } from '../middlewares/validate.middleware';
import { likeSchemas, postSchemas } from '../validations/schemas';
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
router.get('/', validate(postSchemas.getMany), asyncMiddleware(getPosts));

router.get(
  '/search',
  validate(postSchemas.search),
  asyncMiddleware(searchPosts),
);
router.get('/:id', asyncMiddleware(getPost));

// Protected routes
router.use(authenticate);

// Apply rate limiting to post creation and interactions
router.post(
  '/',
  validate(postSchemas.create),
  rateLimiter,
  asyncMiddleware(createPost),
);
router.put(
  '/:id',
  validate(postSchemas.update),
  rateLimiter,
  asyncMiddleware(updatePost),
);
router.delete(
  '/:id',
  validate(postSchemas.delete),
  asyncMiddleware(deletePost),
);

// Like/Unlike with rate limiting
router.post(
  '/:id/like',
  validate(likeSchemas.checkLikeStatus),
  rateLimiter,
  asyncMiddleware(likePost),
);
router.delete(
  '/:id/like',
  validate(likeSchemas.checkLikeStatus),
  rateLimiter,
  asyncMiddleware(unlikePost),
);

export default router;
