const path = require('path');
const packager = require('electron-packager');
const chalk = require('chalk');
const signAsync = require('electron-osx-sign').signAsync
const { notarize } = require('electron-notarize');
const pkg = require('../package.json')

const DEFAULT_OPTIONS = {
  name: pkg.name,
  dir: path.resolve(__dirname, '..'),
  out: './dist/package',
  icon: path.resolve(__dirname, '..', 'resources', 'icon.icns'),
  overwrite: true,
  prune: true,
  appBundleId: 'com.pictarine.pictasearch',
  ignore: [
    '__mocks__/',
    'docs/.*.md',
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
  ],
  osxSign: {
    'provisioning-profile': path.resolve(__dirname, '..', 'embedded.provisionprofile'),
    identity: process.env.identity,
    entitlements: path.resolve(__dirname, '..', 'entitlements.mac.plist'),
    'entitlements-inherit': path.resolve(__dirname, '..', 'entitlements.inherit.mac.plist'),
    type: 'development',
    platform: 'darwin',
    'gatekeeper-assess': true,
    'hardened-runtime': true,
    app: path.resolve(__dirname, '..', 'dist', 'package', `${pkg.name}-darwin-x64`, `${pkg.name}.app`)
  },
  osxNotarize: {
    appBundleId: 'com.pictarine.pictasearch',
    appPath: path.resolve(__dirname, '..', 'dist', 'package', `${pkg.name}-darwin-x64`, `${pkg.name}.app`),
    appleId: process.env.appleId,
    appleIdPassword: process.env.appleIdPassword,
  }
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
