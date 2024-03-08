'use strict';
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

    const getEventsInner = emitter => {
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
    console.debug(`🚀--BLLR? ----------------------🚀--BLLR?`);
    console.debug(`🚀--BLLR? -> eventHelpers -> electron ipcRenderer ->`, electron);
    console.debug(`🚀--BLLR? ----------------------🚀--BLLR?`);
    // const remote = electron.remote;

    return {
      // 'electron.BrowserWindow': getEventsInner(),
      // 'electron.WebContents': getEventsInner(),
      // 'electron.app': getEventsInner(electron.app),
      // 'electron.ipcMain': getEventsInner(ipcMain),
      'electron.ipcRenderer': getEventsInner(electron.ipcRenderer),
      // 'electron.main.process': getEventsInner(process),
      'global.process': getEventsInner(process),
    };
  });
};
