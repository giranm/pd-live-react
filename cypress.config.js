const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 15000,
  retries: 3,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000/pd-live-react',
    specPattern: 'cypress/e2e/**/*.spec.{js,ts,jsx,tsx}',
  },
  component: {
    setupNodeEvents(on, config) {},
    specPattern: 'src/**/*.spec.{js,ts,jsx,tsx}',
  },
})
