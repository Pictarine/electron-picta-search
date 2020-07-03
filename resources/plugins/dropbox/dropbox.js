const Store = require('electron-store');
const axios = require('axios');

const store = new Store();

const pad = (s) => {
  return (s < 10) ? `0${s}` : s;
}

function metadataToItem(meta) {
  const path = meta.path_display;
  const matches = path.match(/[^\/]+(?=\/$|$)/);
  const d = new Date(meta.client_modified);

  return {
    title: (matches && matches.length > 0) ? matches[0] : path,
    subtitle: meta.client_modified ? `${meta['.tag']} - ${[pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')}` : meta['.tag'],
    arg: {
      script: './searchFile.js',
      arg: [path]
    },
  };
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

    const headers = {
      "Authorization": `Bearer ${store.get('dropbox_tokens').access_token}`,
      "Content-Type": "application/json"
    }

    if (q.startsWith('https://www.dropbox.com/')) {
      // let u = 'https://www.dropbox.com/sh/6pc0crgyymekk3x/AABitssJ717nGM-1J_e2o_Y4a?dl=0'
      // let u = 'https://www.dropbox.com/s/o75m30hfhm35ky5/HowTo_Sunset.mp4?dl=0'
      axios({
        method: 'POST',
        url: "https://api.dropboxapi.com/2/sharing/get_shared_link_metadata",
        data: `{"url": "${q}"}`,
        headers
      }).then(res => {
        console.log('res', res.data)
        axios({
          method: 'POST',
          url: "https://api.dropboxapi.com/2/files/get_metadata",
          data: `{"path": "${res.data.id}"}`,
          headers
        }).then(res2 => {
          console.log('res2', res2.data)
          const item2 = metadataToItem(res2.data)
          console.log('item2', item2)
          resolve({items: [item2]});
        }).catch(err => {
          console.log(err)
          resolve({items: []});
        })
      }).catch(err => {
        console.log(err)
        resolve({items: []});
      })
      return;
    }

    const searchUrl = "https://api.dropboxapi.com/2/files/search_v2"
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
        console.log(file)

        if (file.metadata && file.metadata.metadata && file.metadata.metadata['.tag'] !== 'folder') {

          const meta = file.metadata.metadata;
          const item = metadataToItem(meta)
          items.push(item);
        }

      })

      resolve({items: items.slice(0, 20)});

    }).catch(err => {
      console.log(err)
      resolve({items: []});
    })

  })
}
