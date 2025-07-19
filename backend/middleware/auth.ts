import type { MiddlewareHandler } from 'hono';
import jwt from 'jsonwebtoken';
import type { AuthPayload } from '../types/user';

const authMiddleware: MiddlewareHandler = async (c, next) => {
  const auth = c.req.header('Authorization');
  if (!auth?.startsWith('Bearer ')) return c.json({ message: 'Unauthorized' }, 401);

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    c.set('user', decoded);
    return await next();
  } catch {
    return c.json({ message: 'Invalid token' }, 401);
  }
};

export default authMiddleware;
