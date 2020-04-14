const path = require('path');
const chalk = require('chalk');
const createDMG = require('electron-installer-dmg')
const pkg = require('../package.json')

const appPath = path.resolve(__dirname, '..', 'dist', 'package', 'lookr-darwin-x64', 'lookr.app');

const DEFAULT_OPTIONS = {
  appPath,
  name: pkg.name,
  out: './dist/release',
  icon: path.resolve(__dirname, '..', 'resources', 'icon.icns'),
  title: pkg.name,
  overwrite: true,
  contents: [
    {x: 448, y: 344, type: 'link', path: '/Applications'},
    {x: 192, y: 344, type: 'file', path: appPath}
    ]
}

/**
 * Print the status of the archive
 */
const printStatus = (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(chalk.red(`archiving error.`));
  } else {
    // eslint-disable-next-line no-console
    console.log(chalk.green(`archive complete.`));
  }
};

// start archiving
createDMG(DEFAULT_OPTIONS, function done(err) {
  printStatus({err})
})
