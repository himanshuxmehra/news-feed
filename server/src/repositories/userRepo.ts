import { DatabaseError } from 'pg';
import pool from '../config/postgres';
import { DbError } from '../utils/dbErrors';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export const userRepo = {
  create: async (
    email: string,
    password: string,
    name: string,
  ): Promise<User> => {
    try {
      const sql = `
        INSERT INTO users (email, password, name)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await pool.query<User>(sql, [email, password, name]);
      return result.rows[0];
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === '23505') {
          throw new DbError('Email already exists', 409);
        }
      }
      throw error;
    }
  },

  findByEmail: async (email: string): Promise<User | null> => {
    try {
      const sql = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query<User>(sql, [email]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  findById: async (id: string): Promise<User | null> => {
    try {
      const sql = 'SELECT * FROM users WHERE id = $1';
      const result = await pool.query<User>(sql, [id]);
      return result.rows[0];
    } catch (error) {
      if (error instanceof DbError) throw error;
      throw error;
    }
  },
};
