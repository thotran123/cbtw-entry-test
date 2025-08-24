import { defineConfig } from 'cypress';
import cypressMochawesomeReporter from 'cypress-mochawesome-reporter/plugin.js';
import credsByEnv from './cypress/fixtures/reqres-creds.js';

const PROFILE = process.env.TEST_ENV || 'test';
const profile = credsByEnv[PROFILE] || credsByEnv.test;

const baseUrlByEnv = {
  test:  'https://reqres.in', // change if you truly have different hosts
  stage: 'https://reqres.in',
};

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'reports/mocha',
    reportPageTitle: 'CBTW - Entry Test',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    screenshotOnRunFailure: false,
    baseUrl: baseUrlByEnv[PROFILE],
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      cypressMochawesomeReporter(on, config);
      
       // ensure env exists
      config.env = config.env || {};

      config.env.ENV_NAME        = PROFILE;
      config.env.REQRES_API_KEY  = process.env.CYPRESS_REQRES_API_KEY || 'reqres-free-v1';

      // expose both object & primitives for convenience
      config.env.LOGIN_CREDS     = profile.login;

      console.log(`[Cypress] ENV=${PROFILE} baseUrl=${config.baseUrl}`);
      return config;
    },
  },
});