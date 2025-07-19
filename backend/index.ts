import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from 'bun';
import authRoutes from './routes/auth';
import chirpRoutes from './routes/chirps';

const app = new Hono();

app.route('/api', authRoutes);
app.route('/api', chirpRoutes);
app.use(
  '*',
  cors({
    origin: process.env.CLIENT_URL!,
    credentials: true,
  })
);

serve({ fetch: app.fetch, port: parseInt(process.env.PORT!) });
