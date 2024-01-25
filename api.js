const { app, session } = require('electron');

exports.install = () => {
  app.whenReady().then(async () => {
    if (process.type === 'renderer') {
      console.log(`[RENDERER] Installing Devtron from ${__dirname}`);

      if (await session?.defaultSession?.getAllExtensions()?.devtron) {
        console.debug('🚀--BLLR?: RENDERER -> EXISTING DEVTRON FOUND'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
        return true;
      }

      console.debug(
        '🚀--BLLR?: RENDERER -> ELECTRON SESSION ->',
        JSON.parse(JSON.stringify(session.defaultSession)),
      ); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!

      await session?.defaultSession?.loadExtension(__dirname, { allowFileAccess: true });
      return true;
    } else if (process.type === 'browser') {
      console.log(`[BROWSER] Installing Devtron from ${__dirname}`);

      if (await session?.defaultSession?.getAllExtensions()?.devtron) {
        console.debug('🚀--BLLR?: BROWSER -> EXISTING DEVTRON FOUND'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
        return true;
      }

      console.debug(
        '🚀--BLLR?: BROWSER -> ELECTRON SESSION ->',
        JSON.parse(JSON.stringify(session.defaultSession)),
      ); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!

      await session?.defaultSession?.loadExtension(__dirname, { allowFileAccess: true });
      return true;
    } else {
      throw new Error('Devtron can only be installed from an Electron process.');
    }
  });
};

exports.uninstall = () => {
  app.whenReady().then(async () => {
    if (process.type === 'renderer') {
      console.log(`[RENDERER] Uninstalling Devtron from ${__dirname}`);
      await session?.defaultSession?.removeExtension('devtron');
      return true;
    } else if (process.type === 'browser') {
      console.log(`[BROWSER] Uninstalling Devtron from ${__dirname}`);
      await session?.defaultSession?.removeExtension('devtron');
      return true;
    } else {
      throw new Error('Devtron can only be uninstalled from an Electron process.');
    }
  });
};

exports.path = __dirname;
