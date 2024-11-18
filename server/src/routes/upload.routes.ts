import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { asyncMiddleware } from '../middlewares/async.middleware';
import { uploadImages, deleteImage } from '../controllers/upload.controller';
import { validate } from '../middlewares/validate.middleware';
import { uploadSchemas } from '../validations/schemas';
import { rateLimiter } from '../middlewares/rate.middleware';

const router = Router();

// All upload routes are protected
router.use(authenticate);

// Apply strict rate limiting to uploads
router.post(
  '/',
  validate(uploadSchemas.upload),
  rateLimiter,
  asyncMiddleware(uploadImages),
);
router.delete(
  '/',
  validate(uploadSchemas.delete),
  rateLimiter,
  asyncMiddleware(deleteImage),
);

export default router;
