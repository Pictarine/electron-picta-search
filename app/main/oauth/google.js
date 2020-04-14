const {parse} = require('url');
const {BrowserWindow} = require('electron');
const {google} = require('googleapis');
const Store = require('electron-store');

const store = new Store();

const {
  IPC_WINDOW_NAVIGATE,
  IPC_WINDOW_DID_NAVIGATE,
} = require('../../ipc');

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
} = require('../../constants')

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${REDIRECT_URI}gmail`
);

const scopes = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive',
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
      prompt: 'consent',
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

  // eslint-disable-next-line no-console
  console.log('Tokens', tokens);
}

module.exports = {
  googleSignIn,
}
