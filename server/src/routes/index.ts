import { Router } from 'express';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/uploads', uploadRoutes);

export default router;
