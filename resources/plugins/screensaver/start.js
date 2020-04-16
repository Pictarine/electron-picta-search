const { exec, execFile } = require('child_process');

screenSaver = () => {
  if (process.platform === 'darwin') {
    return execFile('open', ['/System/Library/CoreServices/ScreenSaverEngine.app']);
  } else if (process.platform === 'win32') {
    return execFile('cmd.exe', ['/c', 'for', '/f', 'tokens=3* delims= ', '%a', 'in', '(\'reg', 'query', 'HKCU\\Control Panel\\Desktop', '/v', 'SCRNSAVE.EXE\')', 'do', '%a', '/run']);
  } else if (process.platform === 'linux') {
    return exec('xdg-screensaver', ['activate']);
  }
  return null;
};

screenSaver();
