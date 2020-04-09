const path = require('path');

const WINDOW_DEFAULT_WIDTH = 700;
const WINDOW_DEFAULT_HEIGHT = 80;
const WINDOW_MIN_HEIGHT = 80;
// results + query + padding
const WINDOW_MAX_HEIGHT = 710;

const GOOGLE_CLIENT_ID = '770941246865-46okqgv94k4bojmiqbtgfggk8j6f5qib.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = 'VsP9E8hFaDGZ3wVgv91ji8pk'
const GOOGLE_REDIRECT_URI = 'https://junior-dot-backend-dot-picta-int.appspot.com/oauth/callback/v2/gmail'

module.exports = {
  MAX_RESULTS: 20,
  IS_DEV: process.env.NODE_ENV === 'development',
  CORE_PLUGIN_PATH: path.resolve(__dirname, '..', 'resources', 'plugins'),
  // ms
  DEBOUNCE_TIME: 100,
  WINDOW_DEFAULT_HEIGHT,
  WINDOW_DEFAULT_WIDTH,
  WINDOW_MAX_HEIGHT,
  WINDOW_MIN_HEIGHT,
  // google
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
};
