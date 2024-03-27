/* ========================================================================== */
// ALL REQUIRED IMPORTS
/* ========================================================================== */
// Electron
const { app, session } = require('electron');
// Packages
const http = require('http');
const socketIO = require('socket.io');
// Context / Stores / Routers
// Components / Classes / Controllers / Services
const EventsView = require('./lib/events-view');
// Assets / Constants
// Interfaces / Models / Types
const { type } = process;
// Utils / Decorators / Methods / Mocks
const utils = require('./lib/utils');
// Styles

/* ========================================================================== */
// HELPERS, INTERFACES & VARS
/* ========================================================================== */
const PORT = 21324;
let devtronPath = '';
let projectEmittersStored = null;
let socketServer = null;

const ProcessTypes = {
  Browser: 'BROWSER',
  Renderer: 'RENDERER',
};

const typeName = type.toString().toUpperCase();
const isBrowser = typeName === ProcessTypes.Browser;
const isRenderer = typeName === ProcessTypes.Renderer;

const startSocketServer = () => {
  socketServer = http.createServer((req, res) => {
    res.end('Devtron: Socket Server is running');
  });

  const io = socketIO(socketServer);

  io.on('connection', socket => {
    console.info(`Devtron: Socket Server: A user connected, id: ${socket.client.id}`);

    socket.on('get-project-listeners', (value, callback) => {
      if (value === 'devtron-event-helpers') {
        if (projectEmittersStored) {
          const emitterNames = Object.keys(projectEmittersStored);
          const numEmitters = emitterNames.length || 0;

          if (numEmitters > 0) {
            console.info(
              `Devtron: Socket Server: ${numEmitters} 'projectEmittersStored' found, sending response back in callback...`,
              { emitterNames },
            );

            const mappedEmitters = utils.mapEmitterListeners(projectEmittersStored);
            callback(mappedEmitters);
          } else {
            console.info(
              'Devtron: Socket Server: No `projectEmittersStored` found, sending `null` response back in callback...',
              { emitterNames },
            );

            callback(null);
          }
        } else {
          console.error(
            'Devtron: Socket Server: No `projectEmittersStored` found, unable to handle request for `get-project-emitters`',
          );

          callback(null);
        }
      } else {
        // no proper `ack` received log some warning
      }
    });

    socket.on('disconnect', () => {
      console.warn('Devtron: Socket Server: A user disconnected');
    });
  });

  socketServer.listen(PORT, () => {
    console.info(`Devtron: Socket Server: Running on port ${PORT}`);
  });
};

/* ========================================================================== */
// DEFINING THE `DEVTRON API` EXPORTS
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

      if (devtronLoaded) {
        startSocketServer();
      }

      return true;
    } else {
      const errorMessage = 'Devtron can only be installed from an Electron process.';

      console.error(errorMessage, {
        type,
        isBrowser,
        isRenderer,
      });

      throw new Error(errorMessage);
    }
  });
};

exports.setProjectEmitters = (projectEmitters = {}) => {
  let emittersToBeStored = {
    appFromDevtron: app,
  };

  emittersToBeStored = Object.assign(emittersToBeStored, projectEmitters);
  const numEmitters = Object.keys(emittersToBeStored).length || 0;

  console.info(
    `[${typeName}] Devtron: receiving & storing project emitters, count: ${numEmitters}`,
  );

  if (socketServer) {
    projectEmittersStored = emittersToBeStored;

    console.info(
      'Devtron: Socket Server exists, storing the emitters until the client requests them',
      Object.keys(projectEmittersStored),
    );
  } else {
    console.warn(
      'Devtron: Socket Server does NOT exist, unable to store the emitters for the client',
    );
  }
};

exports.uninstall = () => {
  app.whenReady().then(async () => {
    if (isRenderer || isBrowser) {
      console.info(`[${typeName}] Uninstalling Devtron from "${devtronPath}"`);
      await session.defaultSession.removeExtension('devtron');
      return true;
    } else {
      const errorMessage = 'Devtron can only be uninstalled from an Electron process.';

      console.error(errorMessage, {
        type,
        isBrowser,
        isRenderer,
      });

      throw new Error(errorMessage);
    }
  });
};

exports.path = devtronPath;
