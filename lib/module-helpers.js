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
/* ========================================================================== */
// DEFINING THE `MODULE HELPERS` FILE
/* ========================================================================== */
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

const getRenderRequireGraph = () => {
  return Eval.execute(() => {
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

    const rendererModule = walkModule(module);
    rendererModule.appName = 'DevtronPlaceholder';
    rendererModule.count = count;
    rendererModule.resourcesPath = process.resourcesPath;
    return rendererModule;
  });
};

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

    const { processMainModule, resourcesPath } = await socket.emitWithAck(
      'get-main-module',
      'bllr',
    );

    const mainModule = walkModule(processMainModule);
    mainModule.appName = 'DevtronPlaceholder';
    mainModule.count = count;
    mainModule.resourcesPath = resourcesPath;
    return mainModule;
  });
};

/* ========================================================================== */
// ALL REQUIRED EXPORTS
/* ========================================================================== */
exports.getRenderModules = () => {
  return getRenderRequireGraph().then(createModules).then(loadSizes).then(loadVersions);
};

exports.getMainModules = () => {
  // return getMainRequireGraph().then(createModules).then(loadSizes).then(loadVersions);
  return {};
};
