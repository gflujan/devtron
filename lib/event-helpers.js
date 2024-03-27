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

    const electron = require('electron');

    const allListeners = {
      'global.process': getEventListeners(process),
      'electron.ipcRenderer': getEventListeners(electron.ipcRenderer),
    };

    const client = require('socket.io-client');
    const socket = client.connect('http://localhost:21324');

    socket.emit('get-project-listeners', projectListeners => {
      if (projectListeners) {
        if (projectListeners?.length) {
          // 'electron.ipcMain': getEventListeners(ipcMain),
          // 'electron.BrowserWindow': getEventListeners(),
          // 'electron.WebContents': getEventListeners(),
          // 'electron.app': getEventListeners(electron.app),
          // 'electron.main.process': getEventListeners(process),
          projectListeners.forEach(projectEmitter => {
            const { emitterName, emitterListeners } = projectEmitter;
            // console.debug('🚀--BLLR?: =================== START ===================');
            // console.debug('🚀--BLLR?: EVENT HELPERS -> PROCESSING EMITTER NAME ->', emitterName); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
            // console.debug('🚀--BLLR?: ==================== END ====================');
            allListeners[`electron.${emitterName}`] = emitterListeners;
          });
        } else {
          console.warn(
            'Event Helpers: No `projectListeners` present, something may have gone wrong',
          );
        }

        console.debug('🚀--BLLR?: DO I SEE ALL LISTENERS HERE? ->', allListeners); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
        // return allListeners;
      } else {
        console.warn(
          'Event Helpers: No `projectListeners` came back from the socket server, doing nothing.',
        );
      }
    });

    return allListeners;
  });
};
