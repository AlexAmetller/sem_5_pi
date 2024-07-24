import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { Container } from 'typedi';

import config from '../../../config';
import IAuthController from '../../controllers/IControllers/IAuthController';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  const ctrl = Container.get(config.controllers.auth.name) as IAuthController;

  /**
   * @openapi
   * components:
   *   schemas:
   *     AuthRequest:
   *       type: object
   *       properties:
   *         mail:
   *           type: string
   *           description: User's email
   *           example: admin@lapr.com
   *         password:
   *           type: string
   *           description: User's password
   *           example: admin
   *
   *     GooleOAuthRequest:
   *       type: object
   *       properties:
   *         credential:
   *           type: string
   *           description: Google's OAuth JWT token
   *
   *     RenewTokenRequest:
   *       type: object
   *       properties:
   *         refresh:
   *           type: string
   *           description: Refresh token
   *
   *     AuthResponse:
   *       type: object
   *       properties:
   *         token:
   *           type: string
   *           description: User's authentication token
   *         refresh:
   *           type: string
   *           description: Refresh token
   */

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Mail and password Login
   *     description: Authenticate as user by mail and password
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AuthRequest'
   *     responses:
   *       422:
   *         description: Invalid json data.
   *       401:
   *         description: Invalid authentication credentials.
   *       400:
   *         description: Bad request.
   *       200:
   *         description: Returns the authentication token.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   */
  route.post(
    '/login',
    celebrate({
      [Segments.BODY]: Joi.object({
        mail: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.login(req, res, next),
  );

  /**
   * @openapi
   * /auth/google:
   *   post:
   *     summary: Google OAuth Login
   *     description: Authenticate as user through a Google OAuth token
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/GooleOAuthRequest'
   *     responses:
   *       400:
   *         description: Bad request.
   *       200:
   *         description: Returns the authentication token.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   */
  route.post(
    '/google',
    celebrate({
      [Segments.BODY]: Joi.object({
        credential: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.googleLogin(req, res, next),
  );

  /**
   * @openapi
   * /auth/renew:
   *   post:
   *     summary: Renew user token
   *     description: Renew user's token
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RenewTokenRequest'
   *     responses:
   *       401:
   *         description: Unauthorized.
   *       400:
   *         description: Bad request.
   *       200:
   *         description: Returns the renewed tokens.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   */
  route.post(
    '/renew',
    celebrate({
      [Segments.BODY]: Joi.object({
        refresh: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.renew(req, res, next),
  );
};
