import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import prisma from './db/prisma';
import { initializeSocket } from './lib/socket';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import restaurantRoutes from './routes/restaurant.routes';
import searchHistoryRoutes from './routes/search-history.routes';
import savedRoutes from './routes/saved.routes';
import ownerRoutes from './routes/owner.routes';
import bookingRoutes from './routes/booking.routes';
import chatRoutes from './routes/chat.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server for Socket.IO
const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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
app.use('/api/owner', ownerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);

server.listen(PORT, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});
