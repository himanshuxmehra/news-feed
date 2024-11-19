import { Request, Response } from 'express';
import { userRepo } from '../repositories/userRepo';
import { DbError } from '../utils/dbErrors';

export const createUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    const user = await userRepo.create(email, password, name);
    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof DbError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await userRepo.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
