/* ========================================================================== */
// ALL REQUIRED IMPORTS
/* ========================================================================== */
// Electron
var electron = require('electron');
// Packages
// Context / Stores / Routers
// Components / Classes / Controllers / Services
// Assets / Constants
// Interfaces / Models / Types
// Utils / Decorators / Methods / Mocks
// Styles

/* ========================================================================== */
// INTERNAL HELPERS, INTERFACES & VARS
/* ========================================================================== */
console.debug('🚀--BLLR?: =================== START ===================');
console.debug('🚀--BLLR?: PROCESS ->', process); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
console.debug('🚀--BLLR?: ==================== END ====================');

var ProcessTypes = {
  Browser: 'browser',
  Renderer: 'renderer',
};

var isBrowser = process.type === ProcessTypes.Browser;
var isRenderer = process.type === ProcessTypes.Renderer;
var typeName = process.type.toString().toUpperCase();
var devtronPath = '';

/* ========================================================================== */
// DEFINING THE `(UN-)INSTALLER` EXPORTS
/* ========================================================================== */
exports.install = function (locationPath) {
  if (!locationPath) {
    throw new Error('Devtron must be supplied a path to its location.');
  }

  devtronPath = locationPath;

  console.debug('🚀--BLLR?: ELECTRON STUFF ->', {
    devtronPath: devtronPath,
    type: process.type,
    session: electron.session,
    // app: electron.app,
  });

  electron.app.whenReady().then(async function () {
    var { defaultSession } = electron.session;

    console.debug('🚀--BLLR?: DEFAULT SESSION ->', {
      defaultSession,
    });

    if (isRenderer || isBrowser) {
      console.log(`[${typeName}] Installing Devtron from ${devtronPath}`);

      if (await electron.session?.defaultSession?.getAllExtensions()?.devtron) {
        console.debug(`🚀--BLLR?: ${typeName} -> EXISTING DEVTRON FOUND`); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
        return true;
      }

      await electron.session?.defaultSession?.loadExtension(devtronPath, { allowFileAccess: true });
      return true;
    } else {
      throw new Error('Devtron can only be installed from an Electron process.');
    }
  });
};

exports.uninstall = function () {
  electron.app.whenReady().then(async () => {
    if (isRenderer || isBrowser) {
      console.log(`[${typeName}] Uninstalling Devtron from ${devtronPath}`);
      await electron.session?.defaultSession?.removeExtension('devtron');
      return true;
    } else {
      throw new Error('Devtron can only be uninstalled from an Electron process.');
    }
  });
};

exports.path = devtronPath;
