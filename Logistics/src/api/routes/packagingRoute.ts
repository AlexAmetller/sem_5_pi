import { Request, Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { Container } from 'typedi';

import config from '../../../config';
import IPackagingController from '../../controllers/IControllers/IPackagingController';
import auth from '../../middleware/auth';
import { processRequest } from 'zod-express-middleware';
import { packagingPaginatedQuerySchema, IPackagingPaginationQuery } from '../../dto/IPackagingDTO';

const route = Router();

export default (app: Router) => {
  app.use('/packagings', auth(['logistics-manager']), route);

  const ctrl = Container.get(config.controllers.packaging.name) as IPackagingController;

  /**
   * @openapi
   * components:
   *   schemas:
   *     PackagingProps:
   *       type: object
   *       properties:
   *         xposition:
   *           type: number
   *           description: x position delivery
   *           example: 5
   *         yposition:
   *           type: number
   *           description: y position delivery
   *           example: 5
   *         zposition:
   *           type: number
   *           description: z position delivery
   *           example: 5
   *
   *     PackagingCreate:
   *       allOf:
   *         - type: object
   *           required:
   *             - xposition
   *             - yposition
   *             - zposition
   *             - deliveryId
   *         - $ref: '#/components/schemas/PackagingProps'
   *         - type: object
   *           required:
   *             - xposition
   *           properties:
   *             deliveryId:
   *               type: string
   *               description: Delivery id
   *               example: "4449"
   *     PackagingUpdate:
   *       allOf:
   *         - type: object
   *           required:
   *             - xposition
   *             - yposition
   *             - zposition
   *         - $ref: '#/components/schemas/PackagingProps'
   *
   *     PackagingPartialUpdate:
   *       allOf:
   *         - type: object
   *         - $ref: '#/components/schemas/PackagingProps'
   *
   *     Packaging:
   *       allOf:
   *         - type: object
   *           properties:
   *             id:
   *               type: string
   *               description: Delivery id
   *               example: "4449"
   *           required:
   *             - id
   *             - xposition
   *             - yposition
   *             - zposition
   *             - loadingTime
   *             - withdrawingTime
   *         - $ref: '#/components/schemas/PackagingProps'
   *       type: object
   *       properties:
   *         loadingTime:
   *           type: number
   *           description: Packaging loading time (min)
   *           example: 10
   *         withdrawingTime:
   *           type: number
   *           description: Packaging withdrawing time (min)
   *           example: 50
   *         deliveryId:
   *           type: string
   *           description: Delivery id
   *           example: "4449"
   */

  /**
   * @openapi
   * /api/packagings:
   *   post:
   *     tags:
   *       - Packaging
   *     summary: Create packaging
   *     description: Create a new packaging entity
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PackagingCreate'
   *     responses:
   *       422:
   *         description: Invalid json data.
   *       400:
   *         description: Validation errors.
   *       201:
   *         description: Returns the new created packaging.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Packaging'
   */
  route.post(
    '',
    celebrate({
      [Segments.BODY]: Joi.object({
        deliveryId: Joi.string().required(),
        xposition: Joi.number().required(),
        yposition: Joi.number().required(),
        zposition: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.createPackaging(req, res, next),
  );

  /**
   * @openapi
   * /api/packagings/{id}:
   *   put:
   *     summary: Update packaging
   *     tags:
   *       - Packaging
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: packaging id
   *         example: "4449"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PackagingUpdate'
   *     responses:
   *       404:
   *         description: Not found.
   *       422:
   *         description: Invalid json data.
   *       400:
   *         description: Validation errors.
   *       200:
   *         description: Returns the updated packaging.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Packaging'
   */
  route.put(
    '/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object({ id: Joi.string().required() }),
      [Segments.BODY]: Joi.object({
        xposition: Joi.number().required(),
        yposition: Joi.number().required(),
        zposition: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.updatePackaging(req, res, next),
  );

  /**
   * @openapi
   * /api/packagings/{id}:
   *   patch:
   *     summary: Patch packaging
   *     description: Update a packaging entity partially
   *     tags:
   *       - Packaging
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PackagingPartialUpdate'
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Packaging id
   *         example: "4449"
   *     responses:
   *       422:
   *         description: Invalid json data.
   *       400:
   *         description: Validation errors.
   *       204:
   *         description: Returns the updated packaging.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Packaging'
   */
  route.patch(
    '/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object({ id: Joi.string().required() }),
      [Segments.BODY]: Joi.object({
        xposition: Joi.number(),
        yposition: Joi.number(),
        zposition: Joi.number(),
      }),
    }),
    (req, res, next) => ctrl.updatePackaging(req, res, next),
  );

  /**
   * @openapi
   * /api/packagings/{id}:
   *   get:
   *     summary: Get package
   *     tags:
   *       - Packaging
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Package id
   *         example: "4449"
   *     responses:
   *       500:
   *         description: Server error
   *       404:
   *         description: Not found
   *       200:
   *         description: Returns the packaging.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Packaging'
   */
  route.get(
    '/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object({ id: Joi.string().required() }),
    }),
    (req, res, next) => ctrl.findById(req, res, next),
  );

  /**
   * @openapi
   * /api/packagings:
   *   get:
   *     summary: Get all paths
   *     description: Get all paths
   *     tags:
   *       - Packaging
   *     responses:
   *       500:
   *         description: Server error
   *       200:
   *         description: Returns the existing paths.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Packaging'
   */
  route.get(
    '',
    processRequest({
      query: packagingPaginatedQuerySchema,
    }),
    (req, res, next) => ctrl.findAll(req as Request<any, any, any, IPackagingPaginationQuery>, res, next),
  );
};
