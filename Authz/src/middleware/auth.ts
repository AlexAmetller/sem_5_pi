import { Request, Response, NextFunction } from 'express';
import { parseToken } from '../utils/PasswordUtils';

export default (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers['authorization'];

  const token = header?.split(' ')[1];

  if (!token) return res.status(401).send('Access denied.');

  const user = parseToken(token);

  if (user.isFailure || user.getValue().role !== 'admin') return res.status(401).send({ message: 'Unauthorized.' });

  req['user'] = user.getValue();
  next();
};
