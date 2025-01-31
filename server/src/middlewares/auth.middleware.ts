import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { DbError } from '../utils/dbErrors';
import { userRepo } from '../repositories/userRepo';

interface JwtPayload {
  userId: string;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

export const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from cookie or header
    const token =
      req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.log('No token');
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    // Get user from database
    const user = await userRepo.findById(decoded.userId);
    if (!user) {
      console.log('User not found');
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;

    // Add user to request object
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    next(new DbError('Invalid token', 401));
    return;
  }
};
