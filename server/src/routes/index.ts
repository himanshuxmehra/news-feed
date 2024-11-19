import { Router } from 'express';
import authRoutes from './auth.routes';
import postRoutes from './post.routes';
import uploadRoutes from './upload.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/uploads', uploadRoutes);
router.use('/users', userRoutes);

export default router;
