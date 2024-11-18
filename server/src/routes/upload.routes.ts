import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { asyncMiddleware } from '../middlewares/async.middleware';
import { uploadImages, deleteImage } from '../controllers/upload.controller';
import { validate } from '../middlewares/validate.middleware';
import { rateLimiter } from '../middlewares/rate.middleware';

// Configure multer for file uploads
const router = Router();

// All upload routes are protected
router.use(authenticate);

// Apply strict rate limiting to uploads
router.post('/', rateLimiter, asyncMiddleware(uploadImages));
router.delete('/', rateLimiter, asyncMiddleware(deleteImage));

export default router;
