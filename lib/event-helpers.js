const Eval = require('./eval');

exports.getEvents = () => {
  return Eval.execute(() => {
    const formatCode = listener => {
      const lines = listener.split(/\r?\n/);

      if (lines.length === 1) {
        return listener;
      }

      const lastLine = lines[lines.length - 1];
      const lastLineMatch = /^(\s+)}/.exec(lastLine);

      if (!lastLineMatch) {
        return listener;
      }

      const whitespaceRegex = new RegExp('^' + lastLineMatch[1]);

      const mappedLines = lines
        .map(line => {
          return line.replace(whitespaceRegex, '');
        })
        .join('\n');

      return mappedLines;
    };

    const getEventListeners = emitter => {
      const events = {};

      Object.keys(emitter._events)
        .sort()
        .forEach(name => {
          const listeners = emitter.listeners(name);

          if (listeners.length > 0) {
            events[name] = listeners.map(listener => {
              return formatCode(listener.toString());
            });
          }
        });

      return events;
    };

    let projectEmitters = null;
    const electron = require('electron');
    const client = require('socket.io-client');
    const socket = client.connect('http://localhost:21324');

    socket.emit('get-project-emitters', response => {
      if (response) {
        console.debug('🚀--BLLR?: DO I SEE PROJ EMS HERE? ->', response); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
        projectEmitters = response;
      } else {
        console.warn(
          'Event Helpers: No `projectEmitters` came back from the socket, doing nothing.',
        );
      }
    });

    // console.debug(`🚀--BLLR? ----------------------🚀--BLLR?`);
    // console.debug(`🚀--BLLR? -> eventHelpers -> electron.ipcRenderer ->`, electron.ipcRenderer);
    // console.debug(`🚀--BLLR? -> eventHelpers -> projectEmitters ->`, projectEmitters);
    // console.debug(`🚀--BLLR? ----------------------🚀--BLLR?`);

    return {
      'global.process': getEventListeners(process),
      'electron.ipcRenderer': getEventListeners(electron.ipcRenderer),
      // 'electron.ipcMain': getEventListeners(ipcMain),
      // 'electron.BrowserWindow': getEventListeners(),
      // 'electron.WebContents': getEventListeners(),
      // 'electron.app': getEventListeners(electron.app),
      // 'electron.main.process': getEventListeners(process),
    };
  });
};
