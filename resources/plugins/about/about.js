// Twitter Icon by Freepik <http://www.flaticon.com/free-icon/twitter_168802#term=twitter&page=1&position=31>
// GitHub Icon by Freepik <http://www.flaticon.com/free-icon/github-mascot-logo-variant_38521#term=github&page=1&position=30>

module.exports = {
  action: 'openurl',
  query: query => {
    let items = [];
    if (query === '?' || query === 'help' || query === 'about') {
      items = [
        {
          title: 'Fork by Pictarine Inc.',
          subtitle: 'From Dext Project',
          arg: 'https://twitter.com/pictarine',
          icon: {
            path: './twitter.png',
          },
        },
      ];
    }
    return { items };
  },
};
