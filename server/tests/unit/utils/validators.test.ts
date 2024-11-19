import { validateEmail, validatePassword } from '@/validations/schemas';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });

    it('should reject empty email', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      expect(validatePassword('StrongPass123!')).toBe(true);
    });

    it('should reject password without uppercase', () => {
      expect(validatePassword('weakpass123!')).toBe(false);
    });

    it('should reject password without number', () => {
      expect(validatePassword('WeakPass!')).toBe(false);
    });

    it('should reject short password', () => {
      expect(validatePassword('Short1!')).toBe(false);
    });
  });
});
