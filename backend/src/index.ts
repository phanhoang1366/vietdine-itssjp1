import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import prisma from './db/prisma';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import restaurantRoutes from './routes/restaurant.routes';
import searchHistoryRoutes from './routes/search-history.routes';
import savedRoutes from './routes/saved.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow Next.js frontend
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/search-history', searchHistoryRoutes);
app.use('/api/saved', savedRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});
