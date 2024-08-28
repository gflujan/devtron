// This defines globals that will be used in the browser context
// (via the content_scripts definition in manifest.json)
//
// It is generated via `npm run-script prepublish`

console.error('🚀--BLLR?: ===================[ START ]===================');
console.error('🚀--BLLR?: WINDOW DEVTRON BEFORE ->', window.__devtron); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
console.error('🚀--BLLR?: ====================[ END ]====================');

window.__devtron = window.__devtron || {};

console.error('🚀--BLLR?: ===================[ START ]===================');
console.error('🚀--BLLR?: WINDOW DEVTRON AFTER ->', JSON.stringify(window.__devtron)); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
console.error('🚀--BLLR?: ====================[ END ]====================');
