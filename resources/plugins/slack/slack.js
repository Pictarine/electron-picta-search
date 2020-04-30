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

    if ((!q && q === '') || !store.get('slack_tokens')) {
      resolve({items: []});
      return;
    }

    if (q.match(/(\d+\s*(\*|\/|\+|\-)\s*)+(\d+\s*)/)) {
      resolve({items: []});
      return;
    }

    const token = store.get('slack_tokens');

    const searchUrl = `https://slack.com/api/search.all`

    axios.get(searchUrl, {
      params: {
        token: token.access_token,
        query: q
      }
    }).then(res => {

      let items = [];

      if (!res.data.messages || !res.data.messages.matches || res.data.messages.matches.length === 0) {
        resolve({items});
        return;
      }

      res.data.messages.matches.forEach(mess => {

         const item = {
            title: mess.text,
            subtitle: `From ${mess.username}`,
            arg: `slack://channel?team=${mess.team}&id=${mess.channel.id}&message=${mess.ts}`,
          };

          items.push(item);

      });

      resolve({items});
    }).catch(err => {
      resolve({items: []});
    })

  })
}
