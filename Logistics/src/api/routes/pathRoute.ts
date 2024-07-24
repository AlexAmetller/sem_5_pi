import { Request, Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { processRequest } from 'zod-express-middleware';

import { Container } from 'typedi';

import config from '../../../config';
import IPathController from '../../controllers/IControllers/IPathController';
import { IPathPaginationQuery, pathPaginatedQuerySchema } from '../../dto/IPathDTO';
import auth from '../../middleware/auth';

const route = Router();

export default (app: Router) => {
  app.use('/paths', auth(['logistics-manager']), route);

  const ctrl = Container.get(config.controllers.path.name) as IPathController;

  /**
   * @openapi
   * components:
   *   schemas:
   *     PathProps:
   *       type: object
   *       properties:
   *         truckId:
   *           type: string
   *           description: Truck's unique identifier name
   *           example: "eTruck01"
   *         startWarehouse:
   *           type: string
   *           description: Starting warehouse unique code identifier
   *           example: "W01"
   *         endWarehouse:
   *           type: string
   *           description: Ending warehouse unique code identifier
   *           example: "W17"
   *         distance:
   *           type: number
   *           description: distance
   *           example: 100
   *         time:
   *           type: number
   *           description: time
   *           example: 100
   *         batteryConsumption:
   *           type: number
   *           description: batteryConsumption
   *           example: 5
   *
   *     PathCreate:
   *       allOf:
   *         - type: object
   *           required:
   *             - truckId
   *             - startWarehouse
   *             - endWarehouse
   *             - distance
   *             - time
   *             - batteryConsumption
   *         - $ref: '#/components/schemas/PathProps'
   *
   *     PathUpdate:
   *       allOf:
   *         - type: object
   *           required:
   *             - startWarehouse
   *             - endWarehouse
   *             - distance
   *             - time
   *             - batteryConsumption
   *         - $ref: '#/components/schemas/PathProps'
   *
   *     PathPartialUpdate:
   *       allOf:
   *         - type: object
   *         - $ref: '#/components/schemas/PathProps'
   *
   *
   *     Path:
   *       allOf:
   *         - type: object
   *           properties:
   *             id:
   *               type: string
   *               description: Path id
   *               example: "3f241e13-2c44-42eb-8a7d-c5e500882e50"
   *           required:
   *             - id
   *             - truckId
   *             - startWarehouse
   *             - endWarehouse
   *             - distance
   *             - time
   *             - batteryConsumption
   *         - $ref: '#/components/schemas/PathProps'
   *
   */

  /**
   * @openapi
   * /api/paths:
   *   post:
   *     summary: Create path
   *     description: Create a new path entity
   *     tags:
   *       - Path
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PathCreate'
   *     responses:
   *       422:
   *         description: Invalid json data.
   *       400:
   *         description: Validation errors.
   *       201:
   *         description: Returns the new created path.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Path'
   */
  route.post(
    '',
    celebrate({
      [Segments.BODY]: Joi.object({
        truckId: Joi.string().required(),
        startWarehouse: Joi.string().required(),
        endWarehouse: Joi.string().required(),
        distance: Joi.number().required(),
        time: Joi.number().required(),
        batteryConsumption: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.createPath(req, res, next),
  );

  /**
   * @openapi
   * /api/paths/{id}:
   *   get:
   *     summary: Get path
   *     tags:
   *       - Path
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Path id
   *         example: "3f241e13-2c44-42eb-8a7d-c5e500882e50"
   *     responses:
   *       500:
   *         description: Server error
   *       404:
   *         description: Not found
   *       200:
   *         description: Returns the path.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Path'
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
   * /api/paths:
   *   get:
   *     summary: Get all paths
   *     description: Get all paths
   *     tags:
   *       - Path
   *     responses:
   *       500:
   *         description: Server error
   *       200:
   *         description: Returns the existing paths.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Path'
   */
  route.get(
    '',
    processRequest({
      query: pathPaginatedQuerySchema,
    }),
    (req, res, next) => ctrl.findAll(req as Request<any, any, any, IPathPaginationQuery>, res, next),
  );

  /**
   * @openapi
   * /api/paths/{id}:
   *   put:
   *     summary: Update path
   *     description: Update a path entity
   *     tags:
   *       - Path
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Path id
   *         example: "3f241e13-2c44-42eb-8a7d-c5e500882e50"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PathUpdate'
   *     responses:
   *       422:
   *         description: Invalid json data.
   *       400:
   *         description: Validation errors.
   *       201:
   *         description: Returns the updated path.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Path'
   */
  route.put(
    '/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object({ id: Joi.string().required() }),
      [Segments.BODY]: Joi.object({
        startWarehouse: Joi.string().required(),
        endWarehouse: Joi.string().required(),
        distance: Joi.number().required(),
        time: Joi.number().required(),
        batteryConsumption: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.updatePath(req, res, next),
  );
};
