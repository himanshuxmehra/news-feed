import { Router } from 'express';
import { asyncMiddleware } from '../middlewares/async.middleware';
import { register, login, logout } from '../controllers/auth.controller';
import { rateLimiter } from '../middlewares/rate.middleware';
import { validate } from '../middlewares/validate.middleware';
import { authSchemas } from '../validations/schemas';

const router = Router();

router.post(
  '/register',
  validate(authSchemas.register),
  rateLimiter,
  asyncMiddleware(register),
);
router.post(
  '/login',
  validate(authSchemas.login),
  rateLimiter,
  asyncMiddleware(login),
);
router.post('/logout', asyncMiddleware(logout));

export default router;
