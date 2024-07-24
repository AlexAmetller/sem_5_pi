import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import { Container } from 'typedi';

import config from '../../../config';
import ITruckController from '../../controllers/IControllers/ITruckController';
import auth from '../../middleware/auth';

const route = Router();

export default (app: Router) => {
  app.use('/trucks', route);

  const ctrl = Container.get(config.controllers.truck.name) as ITruckController;

  /**
   * @openapi
   * components:
   *   schemas:
   *     TruckProps:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           description: Truck's unique identifier name
   *           example: eTruck01
   *         tare:
   *           type: number
   *           description: Truck's tare (kg)
   *           example: 100
   *         maxWeight:
   *           type: number
   *           description: Truck max weigth (kg)
   *           example: 1000
   *         maxCharge:
   *           type: number
   *           description: Truck max charge (kWh)
   *           example: 100
   *         range:
   *           type: number
   *           description: Truck range with full charge (km)
   *           example: 100
   *         chargingTime:
   *           type: number
   *           description: Truck charing time from 20% to 80% (h)
   *           example: 5
   *
   *     TruckCreate:
   *       allOf:
   *         - type: object
   *           required:
   *             - name
   *             - tare
   *             - maxWeight
   *             - maxCharge
   *             - range
   *             - chargingTime
   *         - $ref: '#/components/schemas/TruckProps'
   *
   *     TruckUpdate:
   *       allOf:
   *         - type: object
   *           required:
   *             - tare
   *             - maxWeight
   *             - maxCharge
   *             - range
   *             - chargingTime
   *             - enabled
   *         - $ref: '#/components/schemas/TruckProps'
   *         - type: object
   *           properties:
   *             enabled:
   *               type: boolean
   *               description: Truck is enabled for scheduling
   *               example: false
   *
   *     TruckPartialUpdate:
   *       allOf:
   *         - type: object
   *         - $ref: '#/components/schemas/TruckProps'
   *
   *     Truck:
   *       allOf:
   *         - type: object
   *           properties:
   *             id:
   *               type: string
   *               description: Truck's unique identifier name
   *               example: "eTruck01"
   *           required:
   *             - id
   *             - tare
   *             - maxWeight
   *             - maxCharge
   *             - range
   *             - chargingTime
   *         - $ref: '#/components/schemas/TruckProps'
   *         - type: object
   *           properties:
   *             enabled:
   *               type: boolean
   *               description: Truck is enabled for scheduling
   *               example: false
   */

  /**
   * @openapi
   * /api/trucks:
   *   post:
   *     summary: Create truck
   *     description: Create a new truck entity
   *     tags:
   *       - Truck
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TruckCreate'
   *     responses:
   *       422:
   *         description: Invalid json data.
   *       400:
   *         description: Validation errors.
   *       201:
   *         description: Returns the new created truck.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Truck'
   */
  route.post(
    '',
    celebrate({
      [Segments.BODY]: Joi.object({
        id: Joi.string().required(),
        tare: Joi.number().required(),
        maxWeight: Joi.number().required(),
        maxCharge: Joi.number().required(),
        range: Joi.number().required(),
        chargingTime: Joi.number().required(),
      }),
    }),
    auth(['fleet-manager']),
    (req, res, next) => ctrl.createTruck(req, res, next),
  );

  /**
   * @openapi
   * /api/trucks/{id}:
   *   put:
   *     summary: Update truck
   *     tags:
   *       - Truck
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Truck's unique identifier name
   *         example: "eTruck01"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TruckUpdate'
   *     responses:
   *       404:
   *         description: Not found.
   *       422:
   *         description: Invalid json data.
   *       400:
   *         description: Validation errors.
   *       200:
   *         description: Returns the updated truck.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Truck'
   */
  route.put(
    '/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object({ id: Joi.string().required() }),
      [Segments.BODY]: Joi.object({
        tare: Joi.number().required(),
        maxWeight: Joi.number().required(),
        maxCharge: Joi.number().required(),
        range: Joi.number().required(),
        chargingTime: Joi.number().required(),
        enabled: Joi.boolean().required(),
      }),
    }),
    auth(['fleet-manager']),
    (req, res, next) => ctrl.updateTruck(req, res, next),
  );

  /**
   * @openapi
   * /api/trucks/{id}:
   *   patch:
   *     summary: Patch truck
   *     description: Update a truck entity partially
   *     tags:
   *       - Truck
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/TruckPartialUpdate'
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Truck's unique identifier name
   *         example: "eTruck01"
   *     responses:
   *       422:
   *         description: Invalid json data.
   *       400:
   *         description: Validation errors.
   *       204:
   *         description: Returns the updated truck.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Truck'
   */
  route.patch(
    '/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object({ id: Joi.string().required() }),
      [Segments.BODY]: Joi.object({
        tare: Joi.number().optional(),
        maxWeight: Joi.number().optional(),
        maxCharge: Joi.number().optional(),
        range: Joi.number().optional(),
        chargingTime: Joi.number().optional(),
        enabled: Joi.boolean().optional(),
      }),
    }),
    auth(['fleet-manager']),
    (req, res, next) => ctrl.updateTruck(req, res, next),
  );

  /**
   * @openapi
   * /api/trucks/{id}:
   *   get:
   *     summary: Get truck by id
   *     tags:
   *       - Truck
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Truck's unique identifier name
   *         example: "eTruck01"
   *     responses:
   *       404:
   *         description: Not found
   *       200:
   *         description: Returns the truck.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Truck'
   */
  route.get(
    '/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object({ id: Joi.string().required() }),
    }),
    auth(['fleet-manager', 'logistics-manager']),
    (req, res, next) => ctrl.findById(req, res, next),
  );

  /**
   * @openapi
   * /api/trucks:
   *   get:
   *     summary: Get all trucks
   *     tags:
   *       - Truck
   *     responses:
   *       200:
   *         description: Returns the truck.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Truck'
   */
  route.get('', auth(['fleet-manager', 'logistics-manager']), (req, res, next) => ctrl.findAll(req, res, next));
};
