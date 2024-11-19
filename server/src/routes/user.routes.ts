import { Router } from 'express';
import {
  createUser,
  getUserByEmail,
  getUserById,
} from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { userSchemas } from '../validations/schemas';
import { asyncMiddleware } from '../middlewares/async.middleware';

const router = Router();

router.post('/', validate(userSchemas.create), asyncMiddleware(createUser));
router.get(
  '/email/:email',
  validate(userSchemas.getByEmail),
  asyncMiddleware(getUserByEmail),
);
router.get('/:id', validate(userSchemas.getById), asyncMiddleware(getUserById));

export default router;
