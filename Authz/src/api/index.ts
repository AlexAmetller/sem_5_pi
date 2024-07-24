import { Router } from 'express';
import user from './routes/userRoute';
import auth from './routes/authRoute';
import health from './routes/healthRoute';

export default () => {
  const app = Router();

  user(app);
  auth(app);
  health(app);

  return app;
};
