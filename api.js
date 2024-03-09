/* ========================================================================== */
// ALL REQUIRED IMPORTS
/* ========================================================================== */
// Electron
const { app, session } = require('electron');
// Packages
// Context / Stores / Routers
// Components / Classes / Controllers / Services
const EmitterView = require('./lib/emitter-view');
// Assets / Constants
// Interfaces / Models / Types
const { type } = process;
// Utils / Decorators / Methods / Mocks
// Styles

/* ========================================================================== */
// INTERNAL HELPERS, INTERFACES & VARS
/* ========================================================================== */
const ProcessTypes = {
  Browser: 'BROWSER',
  Renderer: 'RENDERER',
};

const typeName = type.toString().toUpperCase();
const isBrowser = typeName === ProcessTypes.Browser;
const isRenderer = typeName === ProcessTypes.Renderer;
let devtronPath = '';

/* ========================================================================== */
// DEFINING THE `(UN-)INSTALLER` EXPORTS
/* ========================================================================== */
exports.install = filePath => {
  if (!filePath) {
    throw new Error('Devtron must be supplied a path to its file location');
  }

  devtronPath = filePath;

  // console.debug('🚀--BLLR?: ELECTRON / NODE STUFF ->', {
  //   process,
  //   session,
  //   defaultSession: session.defaultSession,
  // });

  app.whenReady().then(async () => {
    console.info(`[${typeName}] Beginning install of Devtron from "${devtronPath}"`, {
      isBrowser,
      isRenderer,
    });

    if (isRenderer || isBrowser) {
      if (await session.defaultSession.getAllExtensions().devtron) {
        console.info(`[${typeName}] Existing Devtron Found. Doing nothing.`);
        return true;
      }

      const devtronLoaded = await session.defaultSession.loadExtension(devtronPath, {
        allowFileAccess: true,
      });

      // console.debug('🚀--BLLR?: DEVTRON STUFF ->', {
      //   devtronLoaded,
      // });

      return true;
    } else {
      // TODO **[G]** :: Find the proper way to pass in this object with stuff
      throw new Error('Devtron can only be installed from an Electron process.', {
        type,
        isBrowser,
        isRenderer,
      });
    }
  });
};

exports.setProjectEmitters = (projectEmitters = {}) => {
  let finalEmitters = {
    appFromDevtron: app,
  };

  finalEmitters = Object.assign(finalEmitters, projectEmitters);

  console.info(`[${typeName}] Devtron: receiving & setting project emitters`, {
    finalEmitters,
  });

  EmitterView.setProjectEmitters({
    hola: 'bllr',
  });
};

exports.uninstall = () => {
  app.whenReady().then(async () => {
    if (isRenderer || isBrowser) {
      console.info(`[${typeName}] Uninstalling Devtron from "${devtronPath}"`);
      await session.defaultSession.removeExtension('devtron');
      return true;
    } else {
      // TODO **[G]** :: Find the proper way to pass in this object with stuff
      throw new Error('Devtron can only be uninstalled from an Electron process.', {
        type,
        isBrowser,
        isRenderer,
      });
    }
  });
};

exports.path = devtronPath;
