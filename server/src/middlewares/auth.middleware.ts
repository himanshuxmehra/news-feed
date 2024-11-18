import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PostgresDataSource } from '../config/postgres';
import { User } from '../models/postgres/user.entity';

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key',
    ) as JwtPayload;
    const user = await PostgresDataSource.getRepository(User).findOne({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
