import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { Request, Response, NextFunction } from 'express';
import auth from '../../middleware/auth';

import { Container } from 'typedi';

import config from '../../../config';
import IUserController from '../../controllers/IControllers/IUserController';

const route = Router();

export default (app: Router) => {
  app.use('/users', auth, route);

  const ctrl = Container.get(config.controllers.user.name) as IUserController;

  /**
   * @openapi
   * components:
   *   schemas:
   *     UserCreate:
   *       allOf:
   *         - type: object
   *           required: true
   *           properties:
   *             mail:
   *               type: string
   *               description: User's email
   *               example: user@google.com
   *         - type: object
   *           required: true
   *           properties:
   *             name:
   *               type: string
   *               description: User's name
   *               example: John Smith
   *         - type: object
   *           required: true
   *           properties:
   *             phoneNumber:
   *               type: string
   *               description: User's phone number
   *               example: +351 912 988 113
   *         - type: object
   *           required: true
   *           properties:
   *             role:
   *               type: string
   *               description: User's role
   *               enum: [admin, warehouse-manager, logistics-manager, fleet-manager]
   *               example: admin
   *         - type: object
   *           required: true
   *           properties:
   *             password:
   *               type: string
   *               description: User's password
   *
   *     UserUpdate:
   *       allOf:
   *         - type: object
   *           required: true
   *           properties:
   *             name:
   *               type: string
   *               description: User's name
   *               example: John Smith
   *         - type: object
   *           required: false
   *           properties:
   *             phoneNumber:
   *               type: string
   *               description: User's phone number
   *               example: +351 912 988 113
   *         - type: object
   *           required: false
   *           properties:
   *             role:
   *               type: string
   *               description: User's role
   *               enum: [admin, warehouse-manager, logistics-manager, fleet-manager]
   *               example: admin
   *         - type: object
   *           required: false
   *           properties:
   *             password:
   *               type: string
   *               description: User's password
   *
   *     User:
   *       allOf:
   *         - type: object
   *           required: true
   *           properties:
   *             mail:
   *               type: string
   *               description: User's email
   *               example: user@google.com
   *         - type: object
   *           required: true
   *           properties:
   *             name:
   *               type: string
   *               description: User's name
   *               example: John Smith
   *         - type: object
   *           required: false
   *           properties:
   *             phoneNumber:
   *               type: string
   *               description: User's phone number
   *               example: +351 912 988 113
   *         - type: object
   *           required: true
   *           properties:
   *             role:
   *               type: string
   *               description: User's role
   *               enum: [admin, warehouse-manager, logistics-manager, fleet-manager]
   *               example: admin
   */

  /**
   * @openapi
   * /users:
   *   post:
   *     security:
   *       - Authorization: []
   *     summary: Create user
   *     description: Create a new user entity
   *     tags:
   *       - User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserCreate'
   *     responses:
   *       422:
   *         description: Invalid json data.
   *       400:
   *         description: Validation errors.
   *       201:
   *         description: Returns the new created user.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  route.post(
    '',
    celebrate({
      [Segments.BODY]: Joi.object({
        mail: Joi.string().required(),
        name: Joi.string().required(),
        role: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.createUser(req, res, next),
  );

  /**
   * @openapi
   * /users/{mail}:
   *   patch:
   *     security:
   *       - Authorization: []
   *     summary: Patch user
   *     description: Update a user entity partially
   *     tags:
   *       - User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserUpdate'
   *     parameters:
   *       - in: path
   *         name: mail
   *         schema:
   *           type: string
   *         required: true
   *         description: User's email
   *         example: user@google.com
   *     responses:
   *       422:
   *         description: Invalid json data.
   *       400:
   *         description: Validation errors.
   *       204:
   *         description: Returns the updated user.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  route.patch(
    '/:mail',
    celebrate({
      [Segments.PARAMS]: Joi.object({ mail: Joi.string().required() }),
      [Segments.BODY]: Joi.object({
        name: Joi.string().optional(),
        role: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        password: Joi.string().optional(),
      }),
    }),
    (req, res, next) => ctrl.updateUser(req, res, next),
  );

  /**
   * @openapi
   * /users/{mail}:
   *   get:
   *     security:
   *       - Authorization: []
   *     summary: Get user by mail
   *     tags:
   *       - User
   *     parameters:
   *       - in: path
   *         name: mail
   *         schema:
   *           type: string
   *         required: true
   *         description: User's email
   *         example: user@google.com
   *     responses:
   *       404:
   *         description: Not found
   *       200:
   *         description: Returns the user.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  route.get(
    '/:mail',
    celebrate({
      [Segments.PARAMS]: Joi.object({ mail: Joi.string().required() }),
    }),
    (req: Request, res: Response, next: NextFunction) => ctrl.findByMail(req, res, next),
  );

  /**
   * @openapi
   * /users:
   *   get:
   *     security:
   *       - Authorization: []
   *     summary: Get all users
   *     tags:
   *       - User
   *     responses:
   *       200:
   *         description: Returns the user.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  route.get('', (req, res, next) => ctrl.findAll(req, res, next));

  /**
   * @openapi
   * /users/{mail}:
   *   delete:
   *     security:
   *       - Authorization: []
   *     summary: Soft delete user
   *     tags:
   *       - User
   *     parameters:
   *       - in: path
   *         name: mail
   *         schema:
   *           type: string
   *         required: true
   *         description: User's email
   *         example: user@google.com
   *     responses:
   *       200:
   *         description: User was soft deleted successfully
   */
  route.delete(
    '/:mail',
    celebrate({
      [Segments.PARAMS]: Joi.object({ mail: Joi.string().required() }),
    }),
    (req, res, next) => ctrl.deleteUser(req, res, next),
  );
};
