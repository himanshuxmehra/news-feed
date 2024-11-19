import { userRepo } from '@/repositories/userRepo.ts';
import { testPool } from '../../setup';
import { DbError } from '@/utils/dbErrors';

describe('UserRepository', () => {
  beforeEach(async () => {
    await testPool.query('DELETE FROM users');
  });

  describe('create', () => {
    const userData = {
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
    };

    it('should create a new user', async () => {
      const user = await userRepo.create(
        userData.email,
        userData.password,
        userData.name,
      );

      expect(user).toHaveProperty('id');
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
    });

    it('should throw error for duplicate email', async () => {
      await userRepo.create(userData.email, userData.password, userData.name);

      await expect(
        userRepo.create(userData.email, userData.password, userData.name),
      ).rejects.toThrow(DbError);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const created = await userRepo.create(
        'test@example.com',
        'hashedPassword',
        'Test User',
      );

      const found = await userRepo.findByEmail('test@example.com');
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent email', async () => {
      const user = await userRepo.findByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const created = await userRepo.create(
        'test@example.com',
        'hashedPassword',
        'Test User',
      );

      const found = await userRepo.findById(created.id);
      expect(found).toBeDefined();
      expect(found?.email).toBe(created.email);
    });

    it('should throw error for non-existent id', async () => {
      await expect(userRepo.findById('non-existent-id')).rejects.toThrow(
        DbError,
      );
    });
  });
});
