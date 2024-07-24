/// <reference types="vite/client" />

/*
 * Environment variables are loaded from .env files or ENV vars during
 * development. When served by an nginx server, the index.html will first load an
 * env.js file holding the variables. This file is generated when running the
 * docker image and providing --env flags. e.g:
 */

export default {
  WAREHOUSE_URL:
    window.WAREHOUSE_URL ||
    import.meta.env.WAREHOUSE_URL ||
    'http://localhost:3001',
  LOGISTICS_URL:
    window.LOGISTICS_URL ||
    import.meta.env.LOGISTICS_URL ||
    'http://localhost:3002',
  AUTHZ_URL:
    window.AUTHZ_URL || import.meta.env.AUTHZ_URL || 'http://localhost:3004',
  GOOGLE_CLIENT_ID:
    window.GOOGLE_CLIENT_ID ||
    import.meta.env.GOOGLE_CLIENT_ID ||
    '650677185921-c7jubuh95oe93bqhhk132ecq18h3f40g.apps.googleusercontent.com',
  ENV: import.meta.env.DEV,
}
