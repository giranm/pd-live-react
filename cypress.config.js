const { defineConfig } = require('cypress')
const dotenv = require('dotenv');
const cypressFailFast = require('cypress-fail-fast/plugin');

module.exports = defineConfig({
  video: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 15000,
  retries: 3,
  e2e: {
    setupNodeEvents(on, config) {
      dotenv.config();
      cypressFailFast(on, config);
      config.env.PD_USER_TOKEN = process.env.REACT_APP_PD_USER_TOKEN;
      return config;
    },
    baseUrl: 'http://localhost:3000/pd-live-react',
    specPattern: 'cypress/e2e/**/*.spec.{js,ts,jsx,tsx}',
  },
  component: {
    setupNodeEvents(on, config) {},
    specPattern: 'src/**/*.spec.{js,ts,jsx,tsx}',
  },
})
