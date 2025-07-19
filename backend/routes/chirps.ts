import { Hono } from 'hono';
import db from '../db/db';
import authMiddleware from '../middleware/auth';

const chirps = new Hono();

chirps.get('/chirps', async (c) => {
  const all = await db('chirps')
    .join('users', 'chirps.user_id', 'users.id')
    .select('chirps.id', 'content', 'chirps.created_at', 'users.username', 'user_id')
    .orderBy('chirps.created_at', 'desc');

  return c.json(all);
});

chirps.post('/chirps', authMiddleware, async (c) => {
  const { content } = await c.req.json();
  const user = c.get('user');

  const [chirp] = await db('chirps')
    .insert({ user_id: user.id, content })
    .returning(['id', 'user_id', 'content', 'created_at']);

  return c.json(chirp);
});

export default chirps;
