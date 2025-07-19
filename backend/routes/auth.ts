import { Hono } from 'hono';
import db from '../db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const auth = new Hono();

auth.post('/register', async (c) => {
  const { username, password } = await c.req.json();
  const exists = await db('users').where({ username }).first();
  if (exists) return c.json({ message: 'User exists' }, 409);

  const hash = await bcrypt.hash(password, 10);
  await db('users').insert({ username, password: hash });

  return c.json({ message: 'User created' });
});

auth.post('/login', async (c) => {
  const { username, password } = await c.req.json();
  console.log(c.req.json());
  const user = await db('users').where({ username }).first();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });

  return c.json({ token });
});

export default auth;
