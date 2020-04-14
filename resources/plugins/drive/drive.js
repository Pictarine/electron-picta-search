const {google} = require('googleapis');
const Store = require('electron-store');

const store = new Store();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} = require('../../../app/constants')

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

module.exports = {
  action: 'openurl',
  helper: {
    icon: {
      path: './icon.png',
    },
  },
  query: q => new Promise((resolve) => {

    if (!q && q === '') {
      return [];
    }

    oauth2Client.setCredentials(store.get('tokens'));

    drive.files.list({q: `name contains '${q}'`}).then(res => {

      let items = [];
      if (!res.data.files || res.data.files.length === 0) {
        resolve(items);
        return;
      }

      res.data.files.forEach(file => {

        if (file.kind === 'drive#file' && file.mimeType !== 'application/vnd.google-apps.folder') {
          const item = {
            title: file.name,
            subtitle: '',
            arg: `https://drive.google.com/open?id=${file.id}`,
          };

          items.push(item);
        }

      })

      resolve({items});
    })

  })
}