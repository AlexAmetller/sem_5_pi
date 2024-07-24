import { Router } from 'express';

const route = Router();

export default (app: Router) => {
  app.use('/health', route);

  /**
   * @openapi
   * /health:
   *   get:
   *     summary: Check service health
   *     tags:
   *       - Health
   *     responses:
   *       200:
   *         description: Service is up.
   */
  route.get('', (_req, res, _next) => res.status(200).end());
};
