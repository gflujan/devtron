/* ========================================================================== */
// ALL REQUIRED IMPORTS
/* ========================================================================== */
// Electron
const { app, session } = require('electron');
// Packages
// Context / Stores / Routers
// Components / Classes / Controllers / Services
// Assets / Constants
// Interfaces / Models / Types
const { type } = process;
// Utils / Decorators / Methods / Mocks
// Styles

/* ========================================================================== */
// INTERNAL HELPERS, INTERFACES & VARS
/* ========================================================================== */
let devtronPath = '';

const processTypes = {
  browser: 'browser',
  renderer: 'renderer',
};

const isBrowser = type === processTypes.browser;
const isRenderer = type === processTypes.renderer;
const typeName = type.toString().toUpperCase();

/* ========================================================================== */
// DEFINING THE `(UN-)INSTALLER` EXPORTS
/* ========================================================================== */
exports.install = (locationPath = '') => {
  if (!locationPath) {
    throw new Error('Devtron must be supplied a path to its location.');
  }

  devtronPath = locationPath;

  console.debug('🚀--BLLR?: ELECTRON STUFF ->', {
    devtronPath,
    type,
    session,
    // app,
  });

  app.whenReady().then(async () => {
    const { defaultSession } = session;

    console.debug('🚀--BLLR?: DEFAULT SESSION ->', {
      defaultSession,
    });

    if (isRenderer || isBrowser) {
      console.log(`[${typeName}] Installing Devtron from ${devtronPath}`);

      if (await session?.defaultSession?.getAllExtensions()?.devtron) {
        console.debug(`🚀--BLLR?: ${typeName} -> EXISTING DEVTRON FOUND`); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
        return true;
      }

      await session?.defaultSession?.loadExtension(devtronPath, { allowFileAccess: true });
      return true;
    } else {
      throw new Error('Devtron can only be installed from an Electron process.');
    }
  });
};

exports.uninstall = () => {
  app.whenReady().then(async () => {
    if (isRenderer || isBrowser) {
      console.log(`[${typeName}] Uninstalling Devtron from ${devtronPath}`);
      await session?.defaultSession?.removeExtension('devtron');
      return true;
    } else {
      throw new Error('Devtron can only be uninstalled from an Electron process.');
    }
  });
};

exports.path = devtronPath;
