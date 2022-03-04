/* eslint-disable no-param-reassign */
const injectDevServer = require('@cypress/react/plugins/react-scripts');
const dotenv = require('dotenv');
const cypressFailFast = require('cypress-fail-fast/plugin');

module.exports = (on, config) => {
  dotenv.config();
  injectDevServer(on, config);
  cypressFailFast(on, config);
  config.env.PD_USER_TOKEN = process.env.REACT_APP_PD_USER_TOKEN;
  return config;
};
