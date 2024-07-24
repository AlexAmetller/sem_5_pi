import { Router } from 'express';
import truck from './routes/truckRoute';
import path from './routes/pathRoute';
import packaging from './routes/packagingRoute';
import schedule from './routes/scheduleRoute';

export default () => {
  const app = Router();

  truck(app);
  path(app);
  packaging(app);
  schedule(app);

  return app;
};
