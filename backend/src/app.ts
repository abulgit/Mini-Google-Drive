import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRouter from './routes/auth';
import filesRouter from './routes/files';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/files', filesRouter);
app.use('/api/auth', authRouter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

export default app;