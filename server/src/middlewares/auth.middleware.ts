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
 next: NextFunction
) => {
 try {
   // Get token from cookie or header
   const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

   if (!token) {
      console.log('No token');
      res.status(401).json({ message: 'No token, authorization denied' });
   }

   // Verify token
   const decoded = jwt.verify(
     token,
     process.env.JWT_SECRET || 'your-secret-key'
   ) as JwtPayload;

   // Get user from database
   const user = await userRepo.findById(decoded.userId);
   if (!user) {
     throw new DbError('User not found', 401);
   }

   // Remove password from user object
   const { password, ...userWithoutPassword } = user;
   
   // Add user to request object
   req.user = userWithoutPassword;
   
   next();
 } catch (error) {
   if (error instanceof jwt.JsonWebTokenError) {
      throw new DbError('Invalid token', 401);
   }
   throw error;
 }
};
