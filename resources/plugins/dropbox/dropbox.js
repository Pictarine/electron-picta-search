const Store = require('electron-store');
const axios = require('axios');

const store = new Store();

const pad = (s) => {
  return (s < 10) ? `0${s}` : s;
}

module.exports = {
  action: 'exec',
  helper: {
    icon: {
      path: './icon.png',
    },
  },
  query: q => new Promise((resolve) => {

    if ((!q && q === '') || !store.get('dropbox_tokens')) {
      resolve({items: []});
      return;
    }

    if (q.match(/(\d+\s*(\*|\/|\+|\-)\s*)+(\d+\s*)/)) {
      resolve({items: []});
      return;
    }

    const searchUrl = "https://api.dropboxapi.com/2/files/search_v2"
    const headers = {
      "Authorization": `Bearer ${store.get('dropbox_tokens').access_token}`,
      "Content-Type": "application/json"
    }
    const data = `{"query": "${q}","include_highlights": false}`
    axios({
      method: 'POST',
      url: searchUrl,
      data,
      headers
    }).then(res => {

      let items = [];
      if (!res.data.matches || res.data.matches.length === 0) {
        resolve({items: []});
        return;
      }

      res.data.matches.forEach(file => {

        if (file.metadata && file.metadata.metadata && file.metadata.metadata['.tag'] !== 'folder') {

          const meta = file.metadata.metadata;

          const path = meta.path_display;
          const matches = path.match(/[^\/]+(?=\/$|$)/);
          const d = new Date(meta.client_modified);

          const item = {
            title: (matches && matches.length > 0) ? matches[0] : path,
            subtitle: meta.client_modified ? `${meta['.tag']} - ${[pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')}` : meta['.tag'],
            arg: {
              script: './searchFile.js',
              arg: [path]
            },
          };

          items.push(item);
        }

      })

      resolve({items: items.slice(0, 20)});

    }).catch(err => {
      resolve({items: []});
    })

  })
}
