const Eval = require('./eval');

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

  if (emitter && emitter._events) {
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
  } else {
    console.warn(
      'EventHelpers: `getEventListeners` could not find `emitter._events`, returning empty object.',
      { timestamp: new Date().toISOString() },
    );
  }

  return events;
};

exports.getEvents = async () => {
  // const electron = require('electron');

  // NOTE :: Can I use this to get `ipcRenderer` and `process` again?
  // return Eval.execute(() => {
  // });

  const allListeners = {
    // TODO :: `global.process` is empty/undefined doing things this way
    // figure out where/how I can get it again
    'global.process': getEventListeners(process),
    // TODO :: Figure out how to get this again
    // 'electron.ipcRenderer': getEventListeners(electron.ipcRenderer),
  };

  const client = require('socket.io-client');
  const socket = client.connect('http://localhost:21324');
  const mappedEmitters = await socket.emitWithAck('get-project-listeners', 'devtron-event-helpers');

  console.info('🚀--BLLR?: ===================[ START ]===================');
  console.info(
    `🚀--BLLR?: SOCKET -> EMIT WITH ACK -> ${new Date().toISOString()} ->`,
    mappedEmitters,
  ); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
  console.info('🚀--BLLR?: ====================[ END ]====================');

  if (mappedEmitters) {
    mappedEmitters.forEach(mappedEmitter => {
      const { emitterName, emitterListeners } = mappedEmitter;
      allListeners[`electron.${emitterName}`] = emitterListeners;
    });
  } else {
    console.warn(
      'Event Helpers: No `mappedEmitters` came back from the socket server, something may be wrong. Returning default listeners.',
    );
  }

  console.info('🚀--BLLR?: ===================[ START ]===================');
  console.info(
    `🚀--BLLR?: ALL LISTENERS JUST BEFORE RETURN -> ${new Date().toISOString()} ->`,
    allListeners,
  ); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
  console.info('🚀--BLLR?: ====================[ END ]====================');
  return allListeners;
};
