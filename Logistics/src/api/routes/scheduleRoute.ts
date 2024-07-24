import { Request, Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { Container } from 'typedi';

import config from '../../../config';
import IScheduleController from '../../controllers/IControllers/IScheduleController';
import auth from '../../middleware/auth';
import { processRequest } from 'zod-express-middleware';
import { ISchedulePaginationQuery, schedulePaginatedQuerySchema } from '../../dto/IScheduleDTO';

const route = Router();

export default (app: Router) => {
  app.use('/schedules', auth(['logistics-manager']), route);

  const ctrl = Container.get(config.controllers.schedule.name) as IScheduleController;

  /**
   * @openapi
   * components:
   *   schemas:
   *     ScheduleCreate:
   *       type: object
   *       properties:
   *         truckId:
   *           type: string
   *           description: Truck identifier
   *           example: "eTruck01"
   *         originWarehouseId:
   *           type: string
   *           description: Warehouse code
   *           example: "W01"
   *         deliveryIds:
   *           type: array
   *           description: Delivery code identifier list
   *           items:
   *             type: string
   *           example: [ "4443", "4438", "4439", "4449", "4445" ]
   *
   *     Schedule:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: Schedule id
   *           example: "3f241e13-2c44-42eb-8a7d-c5e500882e50"
   *         truck:
   *           description: Truck used to perform deliveries
   *           schema:
   *             $ref: '#/components/schemas/Truck'
   *         deliveries:
   *           description: Ordered list of deliveries
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/Delivery'
   *         totalTime:
   *           type: number
   *           description: Total delivery time
   *           example: 100
   *         originWarehouse:
   *           $ref: '#/components/schemas/Warehouse'
   */

  /**
   * @openapi
   * /api/schedules:
   *   post:
   *     tags:
   *       - Schedule
   *     summary: Create schedule
   *     description: Create a new schedule entity
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ScheduleCreate'
   *     responses:
   *       422:
   *         description: Invalid json data.
   *       400:
   *         description: Validation errors.
   *       201:
   *         description: Returns the new created schedule.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Schedule'
   */
  route.post(
    '',
    celebrate({
      [Segments.BODY]: Joi.object({
        deliveryIds: Joi.array()
          .items(Joi.string())
          .required(),
        truckId: Joi.string().required(),
        originWarehouseId: Joi.string(),
      }),
    }),
    (req, res, next) => ctrl.createSchedule(req, res, next),
  );

  /**
   * @openapi
   * /api/schedules/{id}:
   *   get:
   *     summary: Get schedule
   *     tags:
   *       - Schedule
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: schedule id
   *         example: "3f241e13-2c44-42eb-8a7d-c5e500882e50"
   *     responses:
   *       500:
   *         description: Server error
   *       404:
   *         description: Not found
   *       200:
   *         description: Returns the schedule.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Schedule'
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
   * /api/schedules:
   *   get:
   *     summary: Get all schedules
   *     description: Get all schedules
   *     tags:
   *       - Schedule
   *     responses:
   *       500:
   *         description: Server error
   *       200:
   *         description: Returns the existing schedules.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Schedule'
   */
  route.get(
    '',
    processRequest({
      query: schedulePaginatedQuerySchema,
    }),
    (req, res, next) => ctrl.findAll(req as Request<any, any, any, ISchedulePaginationQuery>, res, next),
  );
};
