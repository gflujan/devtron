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

    // const client = require('socket.io-client');
    // const socket = client.connect('http://localhost:21324');

    // const mappedEmitters = await socket.emitWithAck(
    //   'get-project-listeners',
    //   'devtron-event-helpers',
    // );

    // console.info('🚀--BLLR?: ===================[ START ]===================');
    // console.info('🚀--BLLR?: SOCKET -> EMIT WITH ACK ->', mappedEmitters); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
    // console.info('🚀--BLLR?: ====================[ END ]====================');

    // if (mappedEmitters) {
    //   mappedEmitters.forEach(mappedEmitter => {
    //     const { emitterName, emitterListeners } = mappedEmitter;
    //     allListeners[`electron.${emitterName}`] = emitterListeners;
    //   });
    // } else {
    //   console.warn(
    //     'Event Helpers: No `mappedEmitters` came back from the socket server, something may be wrong. Returning default listeners.',
    //   );
    // }

    console.info('🚀--BLLR?: ===================[ START ]===================');
    console.info('🚀--BLLR?: ALL LISTENERS JUST BEFORE RETURN ->', allListeners); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
    console.info('🚀--BLLR?: ====================[ END ]====================');
    return allListeners;
  });
};
