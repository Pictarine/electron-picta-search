const {parse} = require('url');
const {BrowserWindow} = require('electron');
const axios = require('axios');
const qs = require('qs');
const {google} = require('googleapis');
const Store = require('electron-store');

const store = new Store();
const {
  IPC_WINDOW_NAVIGATE,
  IPC_WINDOW_DID_NAVIGATE,
} = require('../../ipc');

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token'
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/userinfo/v2/me'

const CLIENT_ID = '770941246865-46okqgv94k4bojmiqbtgfggk8j6f5qib.apps.googleusercontent.com'
const CLIENT_SECRET = 'VsP9E8hFaDGZ3wVgv91ji8pk'
const REDIRECT_URI = 'https://junior-dot-backend-dot-picta-int.appspot.com/oauth/callback/v2/gmail'

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client,
});

const scopes = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
];

function signInWithPopup() {
  return new Promise((resolve, reject) => {
    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
    })

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });

    function handleNavigation(url) {
      const query = parse(url, true).query
      if (query) {
        if (query.error) {
          reject(new Error(`There was an error: ${query.error}`))
        } else if (query.code) {
          // Login is complete
          authWindow.removeAllListeners('closed')
          setImmediate(() => authWindow.close())
          resolve(query.code)
        }
      }
    }

    authWindow.on('closed', () => {
    })

    authWindow.webContents.on(IPC_WINDOW_NAVIGATE, (event, url) => {
      handleNavigation(url)
    })

    authWindow.webContents.on(IPC_WINDOW_DID_NAVIGATE, (event, newUrl) => {
      // eslint-disable-next-line no-console
      console.log(newUrl);
      handleNavigation(newUrl)
    })

    authWindow.loadURL(authUrl)
  })
}

async function googleSignIn() {
  const code = await signInWithPopup()

  const {tokens} = await oauth2Client.getToken(code)

  store.set('tokens', tokens);
  oauth2Client.setCredentials(tokens);
}

async function getGmailMessages() {
  oauth2Client.setCredentials(store.get('tokens'));
  const res = await gmail.users.messages.list({userId: 'me'});
  // eslint-disable-next-line no-console
  console.log(res.data);
}

module.exports = {
  googleSignIn,
  getGmailMessages
}
