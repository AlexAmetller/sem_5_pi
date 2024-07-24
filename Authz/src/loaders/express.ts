import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api';
import config from '../../config';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { errors } from 'celebrate';

export default ({ app }: { app: express.Application }) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get('/status', (_req, res) => {
    res.status(200).end();
  });
  app.head('/status', (_req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  app.use(require('method-override')());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // Load API routes
  app.use(config.api.prefix, routes());

  // Configure Swagger
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Logistics API',
      version: '1.0.0',
    },
    host: config.host,
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          value: 'Bearer <JWT token here>',
        },
      },
    },
  };

  const options = {
    swaggerDefinition,
    apis: ['./src/api/routes/*.ts', './src/api/routes/*.js'],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/', (_req, res) => {
    res.redirect(301, '/docs');
  });

  // catch 404 and forward to error handler
  app.use((_req, _res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  // Handle celebrate errors
  app.use(errors());

  // TODO: standardize and fix this
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err['status'] ?? 500).end();
  });
};
