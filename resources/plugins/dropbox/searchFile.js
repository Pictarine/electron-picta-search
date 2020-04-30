const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {execFile} = require('child_process');

const escapePath = (path) => {
  let localPath = path;
  localPath = localPath.replace(/ /g, '\\ ')
  localPath = localPath.replace(/\(/g, '\\(')
  localPath = localPath.replace(/\)/g, '\\)')
  return localPath;
}


openFile = async (path, filePath, pathFolder) => {

  let localPath = `${escapePath(path)}${escapePath(filePath)}`;

  const {stdout, stderr} = await exec(`test -e ${localPath} && echo file exists || echo file not found`)

  if (stderr) {
    // eslint-disable-next-line no-console
    console.error(`Error getting dropbox file: ${stderr}`);
    return null
  }

  // eslint-disable-next-line no-console
  console.log(localPath, stdout, pathFolder);

  if (stdout.includes('file exists')) {
    return execFile('open', [`${path}${pathFolder}`]);
  }

  return null
}

searchFile = async () => {
  const arg = process.argv;

  const filePath = arg[2];
  const pathFolder = filePath.substring(0, filePath.lastIndexOf('/'));

  const {stdout, stderr} = await exec('cat ~/.dropbox/info.json');

  if (stderr) {
    // eslint-disable-next-line no-console
    console.error(`Error getting dropbox json: ${stderr}`);
    return;
  }

  let dropboxJson = JSON.parse(stdout);
  let isFileOpened = false

  // STEP 1 : LOCAL BUSINESS FOLDER
  if (dropboxJson.business) {
    let resultFileOpening = await openFile(dropboxJson.business.path, filePath, pathFolder)
    if (resultFileOpening !== null) {
      isFileOpened = true
      // eslint-disable-next-line consistent-return
      return resultFileOpening
    }
  }

  // STEP 2 : LOCAL PERSONAL FOLDER
  if (!isFileOpened && dropboxJson.personal) {

    let resultFileOpening = await openFile(dropboxJson.personal.path, filePath, pathFolder)
    if (resultFileOpening !== null) {
      isFileOpened = true
      // eslint-disable-next-line consistent-return
      return resultFileOpening
    }
  }

  // STEP 3 : Open WEB
  if (!isFileOpened) {
    // eslint-disable-next-line consistent-return
    return execFile('open', [`https://www.dropbox.com/work${encodeURI(filePath)}`]);
  }
}


searchFile().then(r => {
  return r
});
