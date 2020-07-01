const path = require('path');
const packager = require('electron-packager');
const chalk = require('chalk');
const signAsync = require('electron-osx-sign').signAsync
const { notarize } = require('electron-notarize');
const signingFolder = '/path/to/signing/folder'
const pkg = require('../package.json')
const signingConf = require(path.resolve(signingFolder,'signing.json'))

const DEFAULT_OPTIONS = {
  name: pkg.name,
  dir: path.resolve(__dirname, '..'),
  out: './dist/package',
  icon: path.resolve(__dirname, '..', 'resources', 'icon.icns'),
  overwrite: true,
  prune: true,
  appBundleId: signingConf.appBundleId,
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
    'provisioning-profile': path.resolve(signingFolder, signingConf.provisioningProfile),
    identity: signingConf.identity,
    entitlements: path.resolve(signingFolder, signingConf.entitlements),
    'entitlements-inherit': path.resolve(signingFolder, signingConf.entitlementsInherit),
    type: 'development',
    platform: 'darwin',
    'gatekeeper-assess': true,
    hardenedRuntime: true,
    app: path.resolve(__dirname, '..', 'dist', 'package', `${pkg.name}-darwin-x64`, `${pkg.name}.app`)
  },
  osxNotarize: {
    appBundleId: signingConf.appBundleId,
    appPath: path.resolve(__dirname, '..', 'dist', 'package', `${pkg.name}-darwin-x64`, `${pkg.name}.app`),
    appleId: signingConf.appleId,
    appleIdPassword: signingConf.appleIdPassword,
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
