const path = require('path');

const WINDOW_DEFAULT_WIDTH = 700;
const WINDOW_DEFAULT_HEIGHT = 80;
const WINDOW_MIN_HEIGHT = 65;
// results + query + padding
const WINDOW_MAX_HEIGHT = 710;

const BACKEND_ENDPOINT = 'https://emerix-dot-backend-dot-picta-int.appspot.com'

module.exports = {
  MAX_RESULTS: 40,
  IS_DEV: process.env.NODE_ENV === 'development',
  CORE_PLUGIN_PATH: path.resolve(__dirname, '..', 'resources', 'plugins'),
  // ms
  DEBOUNCE_TIME: 200,
  WINDOW_DEFAULT_HEIGHT,
  WINDOW_DEFAULT_WIDTH,
  WINDOW_MAX_HEIGHT,
  WINDOW_MIN_HEIGHT,
  BACKEND_ENDPOINT
};
