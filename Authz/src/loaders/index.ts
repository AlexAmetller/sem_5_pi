import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
  await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  // auth
  const authController = {
    name: config.controllers.auth.name,
    path: config.controllers.auth.path,
  };

  const authService = {
    name: config.services.auth.name,
    path: config.services.auth.path,
  };

  // user
  const userSchema = {
    name: 'userSchema',
    schema: '../persistence/schemas/userSchema',
  };

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path,
  };

  const userController = {
    name: config.controllers.user.name,
    path: config.controllers.user.path,
  };

  const userService = {
    name: config.services.user.name,
    path: config.services.user.path,
  };

  // gateways

  dependencyInjectorLoader({
    schemas: [userSchema],
    controllers: [userController, authController],
    repos: [userRepo],
    services: [userService, authService],
    gateways: [],
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
