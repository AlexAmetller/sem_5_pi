import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
  await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  // truck
  const truckSchema = {
    name: 'truckSchema',
    schema: '../persistence/schemas/truckSchema',
  };

  const truckRepo = {
    name: config.repos.truck.name,
    path: config.repos.truck.path,
  };

  const truckController = {
    name: config.controllers.truck.name,
    path: config.controllers.truck.path,
  };

  const truckService = {
    name: config.services.truck.name,
    path: config.services.truck.path,
  };

  // path
  const pathSchema = {
    name: 'pathSchema',
    schema: '../persistence/schemas/pathSchema',
  };

  const pathRepo = {
    name: config.repos.path.name,
    path: config.repos.path.path,
  };

  const pathController = {
    name: config.controllers.path.name,
    path: config.controllers.path.path,
  };

  const pathService = {
    name: config.services.path.name,
    path: config.services.path.path,
  };

  // packaging
  const packagingSchema = {
    name: 'packagingSchema',
    schema: '../persistence/schemas/packagingSchema',
  };

  const packagingRepo = {
    name: config.repos.packaging.name,
    path: config.repos.packaging.path,
  };

  const packagingController = {
    name: config.controllers.packaging.name,
    path: config.controllers.packaging.path,
  };

  const packagingService = {
    name: config.services.packaging.name,
    path: config.services.packaging.path,
  };

  // schedule
  const scheduleSchema = {
    name: 'scheduleSchema',
    schema: '../persistence/schemas/scheduleSchema',
  };

  const scheduleRepo = {
    name: config.repos.schedule.name,
    path: config.repos.schedule.path,
  };

  const scheduleController = {
    name: config.controllers.schedule.name,
    path: config.controllers.schedule.path,
  };

  const scheduleService = {
    name: config.services.schedule.name,
    path: config.services.schedule.path,
  };

  // gateways
  const warehouseGateway = {
    name: config.gateway.warehouse.name,
    path: config.gateway.warehouse.path,
  };

  const planningGateway = {
    name: config.gateway.planning.name,
    path: config.gateway.planning.path,
  };

  dependencyInjectorLoader({
    schemas: [pathSchema, truckSchema, packagingSchema, scheduleSchema],
    controllers: [pathController, truckController, packagingController, scheduleController],
    repos: [pathRepo, truckRepo, packagingRepo, scheduleRepo],
    services: [pathService, truckService, packagingService, scheduleService],
    gateways: [warehouseGateway, planningGateway],
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
