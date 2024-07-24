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
  port: parseInt(process.env.PORT, 10) || 3004,
  host: process.env.HOST || 'localhost:3004',

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/',

  /**
   * Your secret sauce
   */
  jwtPrivateKey: (process.env.JWT_PRIVATE_KEY || 'key').replace(/\\n/g, '\n'),
  jwtAlgorithm: process.env.JWT_ALGORITHM || 'RS256',

  /**
   * Google auth
   */
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',

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
    prefix: '',
  },

  /**
   * URL for external services
   */
  gateway: {},

  controllers: {
    auth: {
      name: 'AuthController',
      path: '../controllers/authController',
    },
    user: {
      name: 'UserController',
      path: '../controllers/userController',
    },
  },

  repos: {
    user: {
      name: 'UserRepo',
      path: '../repos/userRepo',
    },
  },

  services: {
    auth: {
      name: 'AuthService',
      path: '../services/authService',
    },
    user: {
      name: 'UserService',
      path: '../services/userService',
    },
  },
};
