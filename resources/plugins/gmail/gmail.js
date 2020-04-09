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

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client,
});

module.exports = {
  action: 'openurl',
  helper: {
    icon: {
      path: './icon.png',
    },
  },
  query: q => new Promise(resolve => {

    oauth2Client.setCredentials(store.get('tokens'));
    gmail.users.messages.list({userId: 'me', maxResults: 10, q})
      .then(res => {

        const data = res.data;

        if (!data.messages) {
          resolve({items: []});
          return;
        }

        if (data.messages.length === 0) {
          resolve({items: []});
          return;
        }

        let messageDatas = data.messages.map(el => gmail.users.messages.get({userId: 'me', id: el.id}))

        return Promise.all(messageDatas).then(datas => {

          const items = datas.map((msg) => {

            let subject = '';
            let date = '';
            let snippet = '';

            msg.data.payload.headers.forEach(header => {

              if (header.name === 'Subject')
                subject = header.value;

              if (header.name === 'Date')
                date = header.value;
            })

            snippet = msg.data.snippet;

            const item = {
              title: subject,
              subtitle: snippet,
              arg: `https://mail.google.com/mail/u/0/#inbox/${msg.data.threadId}`,
            };

            return item;
          })

          return items;
        })

      })
      .then(items => {
        resolve({items});
      })

  }),

}
