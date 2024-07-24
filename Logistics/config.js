import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10) || 3002,
  host: process.env.HOST || 'localhost:3002',

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/',

  /**
   * Your secret sauce
   */
  jwtPublicKey: (process.env.JWT_PUBLIC_KEY || 'key').replace(/\\n/g, '\n'),
  jwtAlgorithm: process.env.JWT_ALGORITHM || 'RS256',

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  /**
   * URL for external services
   */
  gateway: {
    warehouse: {
      name: 'WarehouseGateway',
      path: '../gateway/warehouseGateway',
      url: process.env.WAREHOUSE_URL || 'http://localhost:3001',
    },
    planning: {
      name: 'PlanningGateway',
      path: '../gateway/planningGateway',
      url: process.env.PLANNING_URL || 'http://localhost:3003',
    },
  },

  controllers: {
    truck: {
      name: 'TruckController',
      path: '../controllers/truckController',
    },
    path: {
      name: 'PathController',
      path: '../controllers/pathController',
    },
    packaging: {
      name: 'PackagingController',
      path: '../controllers/packagingController',
    },
    schedule: {
      name: 'ScheduleController',
      path: '../controllers/scheduleController',
    },
  },

  repos: {
    truck: {
      name: 'TruckRepo',
      path: '../repos/truckRepo',
    },
    path: {
      name: 'PathRepo',
      path: '../repos/pathRepo',
    },
    packaging: {
      name: 'PackagingRepo',
      path: '../repos/packagingRepo',
    },
    schedule: {
      name: 'ScheduleRepo',
      path: '../repos/scheduleRepo',
    },
  },

  services: {
    truck: {
      name: 'TruckService',
      path: '../services/truckService',
    },
    path: {
      name: 'PathService',
      path: '../services/pathService',
    },
    packaging: {
      name: 'PackagingService',
      path: '../services/packagingService',
    },
    schedule: {
      name: 'ScheduleService',
      path: '../services/scheduleService',
    },
  },
};
