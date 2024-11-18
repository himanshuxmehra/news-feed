import { Pool } from 'pg';
import 'dotenv/config';
// const pool = new Pool({
//   user: process.env.POSTGRES_USER || 'postgres',
//   password: process.env.POSTGRES_PASSWORD || 'postgres',
//   host: process.env.POSTGRES_HOST || 'localhost',
//   port: parseInt(process.env.POSTGRES_PORT || '5432'),
//   database: process.env.POSTGRES_DB || 'myapp',
// });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export default pool;
