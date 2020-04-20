const {google} = require('googleapis');
const Store = require('electron-store');

const store = new Store();

const {
  OAuth2Custom
} = require('../../../app/main/utils/helpers/google_custom_oauth');

const oauth2Client = new OAuth2Custom();


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

    if ((!q && q === '') || !store.get('google_tokens')) {
      resolve({items: []});
      return;
    }

    if (q.match(/(\d+\s*(\*|\/|\+|\-)\s*)+(\d+\s*)/)) {
      resolve({items: []});
      return;
    }

    oauth2Client.setCredentials(store.get('google_tokens'));
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
            // console.log(msg)
            // console.log(msg.data.payload.parts)
            const item = {
              subtitle: msg.data.snippet,
              arg: `https://mail.google.com/mail/u/0/#inbox/${msg.data.threadId}`,
              date: new Date(msg.data.internalDate),
            };
            msg.data.payload.headers.forEach(header => {
              if (header.name === 'Subject')
                item.title = header.value;
            })

            if (msg.data.payload.mimeType === 'multipart/alternative' && msg.data.payload.parts) {

              let part = msg.data.payload.parts.filter(function (p) {
                return p.mimeType === 'text/html';
              });

              if (part) {
                item.html = Buffer.from(part[0].body.data, 'base64').toString('utf8')
                item.html = item.html.replace(/"/g, `'`)
              }
            } else if (msg.data.payload.mimeType === 'text/html' && msg.data.payload.body.data) {
              item.html = Buffer.from(msg.data.payload.body.data, 'base64').toString('utf8')
              item.html = item.html.replace(/"/g, `'`)
            }

            return item;
          })

          return items;
        })

      })
      .then(items => {
        resolve({items});
      })

  }),
  details: {
    type: 'html',
    render,
  },
}

function render({
                  html
                }) {
  // console.log(html)
  return `<iframe srcdoc="${html}" style="background-color: white; display: block; width: 100%; height: 100%;"></iframe>`
  // return `<img alt="${title}" style="display: block; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%)"
  // src="http://www.pictarine.com/image.jpg?gs_bucket=picta-prd-user-images&gs_filename=AEDFA590-538E-4AF2-8C2D-A2B9CC53225C/9446ce92758b6694a3322e0cf4ae8e3e_330287&size=330287&x1=0.059842&y1=0.115210&x2=0.943643&y2=0.523573&canvas=false&print=4.0x4.0"
  // />`
}
