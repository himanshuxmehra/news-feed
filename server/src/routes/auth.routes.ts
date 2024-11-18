import { Router } from 'express';
import { asyncMiddleware } from '../middlewares/async.middleware';
import { register, login, logout } from '../controllers/auth.controller';
import { rateLimiter } from '../middlewares/rate.middleware';

const router = Router();

router.post('/register', rateLimiter, asyncMiddleware(register));
router.post('/login', rateLimiter, asyncMiddleware(login));
router.post('/logout', asyncMiddleware(logout));

export default router;
