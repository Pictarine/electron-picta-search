const axios = require('axios');

const ENDPOINT = 'https://api.github.com';

/**
 * Makes a new request to the given endpoint
 *
 * @param {String} endpoint
 * @param {Object} options
 * @return {Promise}
 */
const makeRequest = (endpoint, options) => {

  const url = `${ENDPOINT}/${endpoint.replace(/^\//, '')}`;

  const prom = axios.get(url, {
    params: options,
    headers: {
      'Accept': 'application/vnd.github.VERSION.html'
    }
  });
  return new Promise((resolve, reject) => {
    prom.then(res => resolve(res.data)).catch(err => reject(err));
  });
};

/**
 * Maps the GitHub repository item to a Dext item
 *
 * @param {Object} item
 * @return {Object}
 */
const mapItems = item => Object.assign({}, {
  title: item.full_name,
  subtitle: item.description,
  arg: item.html_url,
  icon: {
    path: item.owner.avatar_url,
  },
  mods: {
    alt: {
      arg: `${item.html_url}/issues`,
      subtitle: 'View project issues.',
    },
    cmd: {
      arg: `https://github.com/${item.full_name.split('/')[0]}`,
      subtitle: 'View author\'s profile.',
    },
  },
});

module.exports = {
  keyword: 'gh',
  action: 'openurl',
  helper: {
    title: 'Search GitHub repositories.',
    subtitle: 'Example: gh gif',
  },
  query: q => new Promise((resolve) => {
    const opts = {
      q: `${q} in:name`,
    };
    // searches the API for repositories by name
    // https://developer.github.com/v3/search/#search-repositories
    makeRequest('/search/repositories', opts)
      .then((body) => {
        const items = body.items
          .map(mapItems)
          .slice(0, 20);
        resolve({items});
      });
  }),
  details: {
    type: 'html',

    // retrieve the preferred README file
    // https://developer.github.com/v3/repos/contents/#get-the-readme
    render: item => new Promise((resolve) => {
      makeRequest(`/repos/${item.title}/readme`)
        .then(body => {
          resolve(body);
        })
        .catch(err => {
          resolve('')
        });

    }),
  },
};
