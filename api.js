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
// console.debug('🚀--BLLR?: =================== START ===================');
// console.debug('🚀--BLLR?: PROCESS ->', process); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
// console.debug('🚀--BLLR?: ==================== END ====================');

const ProcessTypes = {
  Browser: 'browser',
  Renderer: 'renderer',
};

const isBrowser = type.toString().toLowerCase() === ProcessTypes.Browser;
const isRenderer = type.toString().toLowerCase() === ProcessTypes.Renderer;
const typeName = type.toString().toUpperCase();
let devtronPath = '';

/* ========================================================================== */
// DEFINING THE `(UN-)INSTALLER` EXPORTS
/* ========================================================================== */
exports.install = locationPath => {
  if (!locationPath) {
    throw new Error('Devtron must be supplied a path to its location.');
  }

  devtronPath = locationPath;

  // console.debug('🚀--BLLR?: ELECTRON STUFF ->', {
  //   devtronDirnamePath: devtronPath,
  //   type,
  //   // session,
  //   // app,
  // });

  app.whenReady().then(async () => {
    if (isRenderer || isBrowser) {
      console.log(`[${typeName}] Installing Devtron from ${devtronPath}`);

      if (await session.defaultSession.getAllExtensions().devtron) {
        // console.debug(`🚀--BLLR?: ${typeName} -> EXISTING DEVTRON FOUND`); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
        return true;
      }

      const loadedExtension = await session.defaultSession.loadExtension(devtronPath, {
        allowFileAccess: true,
      });

      // console.debug(`🚀--BLLR? -----------------------------------------------------🚀--BLLR?`);
      // console.debug(`🚀--BLLR? -> app.whenReady -> loadedExtension->`, loadedExtension);
      // console.debug(`🚀--BLLR? -----------------------------------------------------🚀--BLLR?`);

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
      await session.defaultSession.removeExtension('devtron');
      return true;
    } else {
      throw new Error('Devtron can only be uninstalled from an Electron process.');
    }
  });
};

exports.path = devtronPath;
