/* ========================================================================== */
// ALL REQUIRED IMPORTS
/* ========================================================================== */
// Electron
// Packages
// Context / Stores / Routers
// Components / Classes / Controllers / Services
// Assets / Constants
// Interfaces / Models / Types
// Utils / Decorators / Methods / Mocks
// Styles

/* ========================================================================== */
// HELPERS, INTERFACES, VARS & SET UP
/* ========================================================================== */
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
        if (typeof emitter.listeners === 'function') {
          const listeners = emitter.listeners(name);

          if (listeners.length > 0) {
            events[name] = listeners.map(listener => {
              return formatCode(listener.toString());
            });
          }
        } else {
          if (emitter._events[name].listener) {
            socket.emit('log-this', {
              name,
              event: emitter._events[name],
              listener: emitter._events[name].listener,
            });
          }
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

/* ========================================================================== */
// DEFINING THE `GENERAL UTILS` FILE
/* ========================================================================== */
const mapStoredEmitterListeners = emitters => {
  const mappedEmitters = [];
  const emitterNames = Object.keys(emitters);

  emitterNames.forEach(emitterName => {
    const emitterListeners = getEventListeners(emitters[emitterName]);
    mappedEmitters.push({ emitterName, emitterListeners });
  });

  return mappedEmitters;
};

module.exports = {
  getEventListeners,
  mapStoredEmitterListeners,
};
