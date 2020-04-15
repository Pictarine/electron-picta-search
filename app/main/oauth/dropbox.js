const {parse} = require('url');
const {BrowserWindow} = require('electron');
const Store = require('electron-store');
const axios = require('axios');

const store = new Store();

const {
  IPC_WINDOW_NAVIGATE,
  IPC_WINDOW_DID_NAVIGATE,
} = require('../../ipc');

const {
  DROPBOX_CLIENT_ID,
  DROPBOX_CLIENT_SECRET,
  REDIRECT_URI,
} = require('../../constants')


function signInWithPopup() {
  return new Promise((resolve, reject) => {
    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
    })

    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}dropbox`;

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

    // eslint-disable-next-line no-console
    console.log('authUrl', authUrl);

    authWindow.loadURL(authUrl, {userAgent: 'Chrome'})
  })
}

function getDropboxTokens(code) {

  return new Promise((resolve, reject) => {
    const tokenUrl = "https://api.dropboxapi.com/oauth2/token"
    const params = {
      "code": code,
      "grant_type": "authorization_code",
      "client_id": DROPBOX_CLIENT_ID,
      "client_secret": DROPBOX_CLIENT_SECRET,
      "redirect_uri": `${REDIRECT_URI}dropbox`
    }

    const data = Object.entries(params)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join('&');

    const options = {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data,
      url: tokenUrl,
    };

    axios(options)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      })

  })
}

async function dropboxSignIn() {
  const code = await signInWithPopup();

  const tokens = await getDropboxTokens(code);

  store.set('dropbox_tokens', tokens);

  // eslint-disable-next-line no-console
  console.log('Dropbox Tokens', tokens);
}

module.exports = {
  dropboxSignIn,
}

