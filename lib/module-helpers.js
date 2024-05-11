'use strict';
/* ========================================================================== */
// ALL REQUIRED IMPORTS
/* ========================================================================== */
// Packages
// Context / Stores / Routers
// Components / Classes / Controllers / Services
const Eval = require('./eval');
const Module = require('./module');
// Assets / Constants
// Interfaces / Models / Types
// Utils / Decorators / Methods / Mocks
// Styles

/* ========================================================================== */
// HELPERS, INTERFACES & VARS
/* ========================================================================== */
const createModules = mainModule => {
  const { appName, resourcesPath } = mainModule;

  const processModule = node => {
    const module = new Module(node.path, resourcesPath, appName);

    node.children.forEach(childNode => {
      module.addChild(processModule(childNode));
    });

    return module;
  };

  const convertedMainModule = processModule(mainModule);
  convertedMainModule.count = mainModule.count;
  return convertedMainModule;
};

const loadSizes = mainModule => {
  let totalSize = 0;

  return Promise.all(
    mainModule.toArray().map(module => {
      return Eval.getFileSize(module.path).then(size => {
        totalSize += size;
        return module.setSize(size);
      });
    }),
  ).then(() => {
    mainModule.totalSize = totalSize;
    return mainModule;
  });
};

const loadVersions = mainModule => {
  return Promise.all(
    mainModule.toArray().map(module => {
      return Eval.getFileVersion(module.path).then(version => module.setVersion(version));
    }),
  ).then(() => mainModule);
};

/* ========================================================================== */
// DEFINING THE `MODULE HELPERS` FILE
/* ========================================================================== */
const getMainRequireGraph = () => {
  return Eval.execute(async () => {
    const client = require('socket.io-client');
    const socket = client.connect('http://localhost:21324');
    let count = 0;

    const walkModule = module => {
      count += 1;
      let modulePath = module.filename || module.id;

      if (process.platform === 'win32') {
        modulePath = modulePath.replace(/\\/g, '/');
      }

      return {
        path: modulePath,
        children: module.children.map(walkModule),
      };
    };

    const { appName, processMainModule, resourcesPath } = await socket.emitWithAck(
      'get-main-module',
      'bllr',
    );

    const mainModule = walkModule(processMainModule);
    mainModule.appName = appName;
    mainModule.count = count;
    mainModule.resourcesPath = resourcesPath;
    return mainModule;
  });
};

const getRenderRequireGraph = () => {
  return Eval.execute(async () => {
    const client = require('socket.io-client');
    const socket = client.connect('http://localhost:21324');
    let count = 0;

    const walkModule = module => {
      let modulePath = module.filename || module.id;
      count += 1;

      if (process.platform === 'win32') {
        modulePath = modulePath.replace(/\\/g, '/');
      }

      return {
        path: modulePath,
        children: module.children.map(walkModule),
      };
    };

    // TODO **[G]** :: I could prolly do something by grabbing `process.env.npm_package_dependencies_*`
    // TODO **[G]** :: and `process.env.npm_package_devDependencies_*` to at least get the names and versions
    const appName = await socket.emitWithAck('get-app-name', 'renderer-graph');

    const rendererModule = walkModule(module);
    rendererModule.appName = appName;
    rendererModule.count = count;
    rendererModule.resourcesPath = process.resourcesPath;
    return rendererModule;
  });
};

/* ========================================================================== */
// ALL REQUIRED EXPORTS
/* ========================================================================== */
exports.getRenderModules = async () => {
  let result;

  try {
    const rendererModules = await getRenderRequireGraph();
    const rendererModulesConverted = await createModules(rendererModules);
    const renderersModulesWithSizes = await loadSizes(rendererModulesConverted);
    const rendererModulesWithVersions = await loadVersions(renderersModulesWithSizes);
    result = rendererModulesWithVersions;
  } catch (error) {
    console.error(
      'getRenderModules: There was a problem creating the converted renderer modules w/ sizes and versions',
      { error },
    );
  }

  return result;
};

exports.getMainModules = async () => {
  // return getMainRequireGraph().then(createModules).then(loadSizes).then(loadVersions);
  let result;

  try {
    console.error('🚀--BLLR?: DEW EYE CEE DIS? 1a ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
    const mainModules = await getMainRequireGraph();
    console.error('🚀--BLLR?: DEW EYE CEE DIS? 1b ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
    const mainModulesConverted = await createModules(mainModules);
    console.error('🚀--BLLR?: DEW EYE CEE DIS? 1c ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
    const mainModulesWithSizes = await loadSizes(mainModulesConverted);
    console.error('🚀--BLLR?: DEW EYE CEE DIS? 1d ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
    const mainModulesWithVersions = await loadVersions(mainModulesWithSizes);
    result = mainModulesWithVersions;
    console.error('🚀--BLLR?: DEW EYE CEE DIS? 1e ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
  } catch (error) {
    console.error(
      'getMainModules: There was a problem creating the converted main modules w/ sizes and versions',
      { error },
    );
  }

  return result;
};
