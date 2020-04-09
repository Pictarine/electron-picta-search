const {parse} = require('url');
const {BrowserWindow} = require('electron');
const axios = require('axios');
const qs = require('qs');
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

function signInWithPopup() {
  return new Promise((resolve, reject) => {
    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
    })

    const urlParams = {
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      scope: 'https://mail.google.com/ openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      include_granted_scopes: true,
      access_type: 'offline',
    }
    const authUrl = `${GOOGLE_AUTHORIZATION_URL}?${qs.stringify(urlParams)}`

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

function fetchAccessTokens(code) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: GOOGLE_TOKEN_URL,
      data: {
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }
    })
      .then(r => {
        // eslint-disable-next-line no-console
        console.log('R', r);
        resolve(r);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log('Error', err);
        reject(err);
      });
  });
}

async function googleSignIn() {
  const code = await signInWithPopup()
  // eslint-disable-next-line no-console
  console.log('Google code', code);
  const tokens = await fetchAccessTokens(code)
}

module.exports = {
  googleSignIn
}
