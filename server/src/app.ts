import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routes from './routes';
import { requestLogger, rateLimiter } from './middlewares';
import pool from './config/postgres';
import 'dotenv/config';

const app = express();

// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

// Logging & Rate Limiting
if (process.env.NODE_ENV === 'production') {
  app.use(rateLimiter);
}
app.use(requestLogger);

// Routes
app.use('/api', routes);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 4000;

pool
  .connect()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

export default app;
