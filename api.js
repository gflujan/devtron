/* ========================================================================== */
// ALL REQUIRED IMPORTS
/* ========================================================================== */
// Electron
const { app, ipcRenderer, session } = require('electron');
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

const timestamp = () => {
  return new Date().toISOString();
};

const startSocketServer = () => {
  socketServer = http.createServer((req, res) => {
    res.end('Devtron: Socket Server is running');
  });

  const io = socketIO(socketServer);

  io.on('connection', socket => {
    console.info(`Devtron: Socket Server: A user connected, id: ${socket.client.id}`, {
      timestamp: timestamp(),
    });

    socket.on('log-this', data => {
      console.info('===================[ START ]===================');
      console.info('Logged data from socket server ->', {
        timestamp: timestamp(),
        data,
      });
      console.info('====================[ END ]====================');
    });

    socket.on('disconnect', () => {
      console.warn('Devtron: Socket Server: A user disconnected', {
        timestamp: timestamp(),
        id: socket.client.id,
      });
    });

    socket.on('get-app-name', (ackValue, callback) => {
      if (ackValue === 'renderer-graph') {
        const appName = app.getName();

        console.info('Devtron: Socket Server: Received request for `get-app-name`', {
          timestamp: timestamp(),
          appName: appName,
        });

        callback(appName);
      } else {
        console.warn(
          'Devtron: Socket Server: Received request for `get-app-name`, but `ackValue` is unknown',
          { timestamp: timestamp() },
        );
      }
    });

    socket.on('get-main-module', (ackValue, callback) => {
      if (ackValue === 'bllr') {
        const appName = app.getName();
        const mainModule = process.mainModule;
        const resourcesPath = process.resourcesPath;

        console.info('Devtron: Socket Server: Received request for `get-main-module`', {
          timestamp: timestamp(),
          appName,
          mainModule,
          resourcesPath,
        });

        callback({ appName, processMainModule, resourcesPath });
      } else {
        console.warn(
          'Devtron: Socket Server: Received request for `get-main-module`, but `ackValue` is unknown',
          { timestamp: timestamp() },
        );

        callback(null);
      }
    });

    socket.on('get-project-listeners', (ackValue, callback) => {
      if (ackValue === 'devtron-event-helpers') {
        if (projectEmittersStored) {
          const emitterNames = Object.keys(projectEmittersStored);
          const numEmitters = emitterNames.length || 0;

          if (numEmitters > 0) {
            console.info(
              `Devtron: Socket Server: ${numEmitters} 'projectEmittersStored' found, sending response back in callback...`,
              { timestamp: timestamp(), emitterNames },
            );

            const mappedEmitters = utils.mapStoredEmitterListeners(projectEmittersStored);
            callback(mappedEmitters);
          } else {
            console.info(
              'Devtron: Socket Server: No `projectEmittersStored` found, sending `null` response back in callback...',
              { timestamp: timestamp(), emitterNames },
            );

            callback(null);
          }
        } else {
          console.error(
            'Devtron: Socket Server: No `projectEmittersStored` found, unable to handle request for `get-project-emitters`',
            { timestamp: timestamp() },
          );

          callback(null);
        }
      } else {
        console.warn(
          `Devtron: Socket Server: No proper 'ackValue' received, unable to handle request for: ${ackValue}`,
        );
      }
    });
  });

  socketServer.listen(PORT, () => {
    console.info(`Devtron: Socket Server: Running on port ${PORT}`, {
      timestamp: timestamp(),
    });
  });
};

/* ========================================================================== */
// DEFINING THE `DEVTRON API` EXPORTS
/* ========================================================================== */
export const install = filePath => {
  if (!filePath) {
    throw new Error('Devtron must be supplied a path to its file location');
  }

  devtronPath = filePath;

  app.whenReady().then(async () => {
    console.info(`[${typeName}] Beginning install of Devtron from "${devtronPath}"`, {
      timestamp: timestamp(),
      isBrowser,
      isRenderer,
    });

    if (isRenderer || isBrowser) {
      if (await session.defaultSession.getAllExtensions().devtron) {
        console.info(`[${typeName}] Existing Devtron Found. Doing nothing.`, {
          timestamp: timestamp(),
        });

        return true;
      }

      const devtronLoaded = await session.defaultSession.loadExtension(devtronPath, {
        allowFileAccess: true,
      });

      if (devtronLoaded) {
        startSocketServer();
      }

      return true;
    } else {
      const errorMessage = 'Devtron can only be installed from an Electron process.';

      console.error(errorMessage, {
        timestamp: timestamp(),
        type,
        isBrowser,
        isRenderer,
      });

      throw new Error(errorMessage);
    }
  });
};

export const setProjectEmitters = (projectEmitters = {}) => {
  let emittersToBeStored = {
    ...(ipcRenderer ? { ipcRenderer } : {}),
  };

  emittersToBeStored = Object.assign(emittersToBeStored, projectEmitters);
  const numEmitters = Object.keys(emittersToBeStored).length || 0;

  console.info(
    `[${typeName}] Devtron: receiving & storing project emitters, count: ${numEmitters}`,
    { timestamp: timestamp() },
  );

  if (socketServer) {
    projectEmittersStored = emittersToBeStored;

    console.info(
      'Devtron: Socket Server exists, storing the emitters until the client requests them',
      { timestamp: timestamp(), emitterNames: Object.keys(projectEmittersStored) },
    );
  } else {
    console.warn(
      'Devtron: Socket Server does NOT exist, unable to store the emitters for the client',
      { timestamp: timestamp() },
    );
  }
};

export const uninstall = () => {
  app.whenReady().then(async () => {
    if (isRenderer || isBrowser) {
      console.info(`[${typeName}] Uninstalling Devtron from "${devtronPath}"`, {
        timestamp: timestamp(),
      });

      await session.defaultSession.removeExtension('devtron');
      return true;
    } else {
      const errorMessage = 'Devtron can only be uninstalled from an Electron process.';

      console.error(errorMessage, {
        timestamp: timestamp(),
        type,
        isBrowser,
        isRenderer,
      });

      throw new Error(errorMessage);
    }
  });
};

export const path = devtronPath;
