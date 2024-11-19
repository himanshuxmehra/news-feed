import { Pool } from 'pg';
import { beforeAll, afterAll, beforeEach } from '@jest/globals';
import { cleanDatabase } from './testUtils';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const testPool = new Pool({
  host: process.env.TEST_DB_HOST,
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  user: process.env.TEST_DB_USER,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_NAME,
});

beforeAll(async () => {
  // Ensure database connection
  await testPool.query('SELECT 1');
});

beforeEach(async () => {
  // Clean database before each test
  await cleanDatabase();
});

afterAll(async () => {
  await testPool.end();
});

export { testPool };
