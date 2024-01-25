const electron = require('electron');

exports.install = () => {
   if (process.type === 'renderer') {
      console.log(`[RENDERER] Installing Devtron from ${__dirname}`);

      if (electron?.remote?.BrowserWindow?.getDevToolsExtensions()?.devtron) {
         return true;
      }

      return electron.remote.BrowserWindow.addDevToolsExtension(__dirname);
   } else if (process.type === 'browser') {
      console.log(`[BROWSER] Installing Devtron from ${__dirname}`);

      if (electron?.BrowserWindow?.getDevToolsExtensions()?.devtron) {
         return true;
      }

      return electron.BrowserWindow.addDevToolsExtension(__dirname);
   } else {
      throw new Error('Devtron can only be installed from an Electron process.');
   }
};

exports.uninstall = () => {
   if (process.type === 'renderer') {
      console.log(`[RENDERER] Uninstalling Devtron from ${__dirname}`);
      return electron.remote.BrowserWindow.removeDevToolsExtension('devtron');
   } else if (process.type === 'browser') {
      console.log(`[BROWSER] Uninstalling Devtron from ${__dirname}`);
      return electron.BrowserWindow.removeDevToolsExtension('devtron');
   } else {
      throw new Error('Devtron can only be uninstalled from an Electron process.');
   }
};

exports.path = __dirname;
