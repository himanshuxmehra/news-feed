import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepo } from '../repositories/userRepo';
import { DbError } from '../utils/dbErrors';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // Validation
  if (!email || !password || !name) {
    console.log('Missing email, password, or name');
    return res.status(400).json({ error: 'Missing email, password, or name' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepo.create(email, hashedPassword, name);

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' },
  );

  res.cookie('token', token, { httpOnly: true });
  return res.status(201).json({
    message: 'User registered successfully',
    token,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new DbError('Missing email or password', 400);
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new DbError('Invalid credentials', 401);
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new DbError('Invalid credentials', 401);
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' },
  );

  res.cookie('token', token, { httpOnly: true });
  return res.json({ token });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
};
