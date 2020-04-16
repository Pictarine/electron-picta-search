const Store = require('electron-store');
const axios = require('axios');

const store = new Store();

module.exports = {
  action: 'openurl',
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

  })
}
