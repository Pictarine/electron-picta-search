const path = require('path');
const packager = require('electron-packager');
const chalk = require('chalk');
const pkg = require('../package.json')

const DEFAULT_OPTIONS = {
  name: pkg.name,
  dir: path.resolve(__dirname, '..'),
  out: './dist/package',
  icon: path.resolve(__dirname, '..', 'resources', 'icon-original.png'),
  overwrite: true,
  prune: true,
  /* ignore: [
    '__mocks__/',
    'dist/',
    'docs/',
    'scripts/',
    '.babelrc',
    '.DS_Store',
    '.editorconfig',
    '.eslintignore',
    '.gitignore',
    'Makefile',
    'README.md',
    'webpack.config.js',
    'webpack.config.prod.js',
    'webpack.config.dev.js',
  ], */
};

/**
 * Print the status of the package
 */
const printStatus = ({err, options}) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(
      chalk.red(`${options.platform}-${options.arch} packaging error.`)
    );
  } else {
    // eslint-disable-next-line no-console
    console.log(
      chalk.green(`${options.platform}-${options.arch} package complete.`)
    );
  }
};

// eslint-disable-next-line no-console
console.log('PATH', path.resolve(__dirname, '..'));

// start packaging
const opts = Object.assign({}, DEFAULT_OPTIONS, {
  platform: 'darwin',
  arch: 'x64',
});

// eslint-disable-next-line no-console
console.log('OPT', opts);

packager(opts).then(() => {
  printStatus({options: {platform: 'darwin', arch: 'x64'}})
})

// pkg('linux', 'x64').then(printStatus);
