import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import checkInRoutes from './routes/checkin.routes';
import propinasRoutes from './routes/propinas.routes';
import repartoRoutes from './routes/reparto.routes';
import statsRoutes from './routes/stats.routes';
import soporteRoutes from './routes/soporte.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middlewares
app.use(helmet());
app.use(cors({ origin: '*' })); // Configure appropriately for production
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/checkins', checkInRoutes);
app.use('/api/propinas', propinasRoutes);
app.use('/api/repartos', repartoRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/soporte', soporteRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('TipPool Backend API is running');
});

// Error handling - MUST be last
app.use(errorHandler);

// Start server
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
