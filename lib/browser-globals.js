// This defines globals that will be used in the browser context
// (via the content_scripts definition in manifest.json)
//
// It is generated via `npm run-script prepublish`

console.error('🚀--BLLR?: ===================[ START ]===================');
console.error('🚀--BLLR?: WINDOW OVERALL ->', window); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
console.error('BROWSER_GLOBALS: Setting up devtron window vars in development environment...', {
  hasProcess: Boolean(process),
  hasRequire: Boolean(require),
  hasWindow: Boolean(window),
});
console.error('🚀--BLLR?: ====================[ END ]====================');

window.__devtron = {
  process: process,
  require: require,
};
