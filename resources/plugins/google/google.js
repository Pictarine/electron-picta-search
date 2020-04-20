const urlencode = require('urlencode');

module.exports = {
  action: 'openurl',
  helper: {
    icon: {
      path: './icon.png',
    },
  },
  query: (query) => {
    const items = [];
    if (!query && query === '') {
      return items;
    }

    if (query.match(/(\d+\s*(\*|\/|\+|\-)\s*)+(\d+\s*)/)) {
      return items;
    }

    const url = 'https:\/\/www.google.com/search?q=' + urlencode(query);
    items.push({
      title: `Search Google for ${query}`,
      subtitle: 'Open in browser',
      arg: url,
      icon: {
        path: './icon.png'
      }
    });
    return {items};
  }
};
