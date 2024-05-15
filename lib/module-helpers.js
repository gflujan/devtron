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
const processModule = incomingModule => {
  const { appName, children, path = '', resourcesPath } = incomingModule;
  const processedModule = new Module(path, resourcesPath, appName);

  if (children?.length) {
    children.forEach(childNode => {
      processedModule.addChild(processModule(childNode));
    });
  }

  return processedModule;
};

const createModules = incomingModule => {
  const { appName, resourcesPath } = incomingModule;
  const convertedMainModule = processModule(incomingModule);
  convertedMainModule.count = incomingModule.count;
  return convertedMainModule;
};

const loadSizes = incomingModule => {
  let totalSize = 0;

  return Promise.all(
    incomingModule.toArray().map(module => {
      return Eval.getFileSize(module.path).then(size => {
        totalSize += size;
        return module.setSize(size);
      });
    }),
  ).then(() => {
    incomingModule.totalSize = totalSize;
    return incomingModule;
  });
};

const loadVersions = incomingModule => {
  return Promise.all(
    incomingModule.toArray().map(module => {
      return Eval.getFileVersion(module.path).then(version => module.setVersion(version));
    }),
  ).then(() => incomingModule);
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

    const walkModule = moduleToWalk => {
      let modulePath = moduleToWalk.filename || moduleToWalk.id;
      count += 1;

      if (process.platform === 'win32') {
        modulePath = modulePath.replace(/\\/g, '/');
      }

      return {
        children: moduleToWalk.children.map(walkModule),
        path: modulePath,
      };
    };

    // TODO **[G]** :: I could prolly do something by grabbing `process.env.npm_package_dependencies_*`
    // TODO **[G]** :: and `process.env.npm_package_devDependencies_*` to at least get the names and versions
    const appName = await socket.emitWithAck('get-app-name', 'renderer-graph');
    // TODO **[G]** :: somewhere in `module.children`, it creates a stack overflow for `walkModule`
    const rendererModule = walkModule(module);
    rendererModule.appName = appName || 'Unknown App Name';
    rendererModule.count = count;
    rendererModule.resourcesPath = process.resourcesPath;
    socket.emit('log-this', rendererModule);
    return rendererModule;
  });
};

/* ========================================================================== */
// ALL REQUIRED EXPORTS
/* ========================================================================== */
exports.getRenderModules = async () => {
  // let result;

  // try {
  //   console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 1a ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
  //   const rendererModules = await getRenderRequireGraph();
  //   console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 1b ->', JSON.stringify(rendererModules)); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
  //   const rendererModulesConverted = await createModules(rendererModules);
  //   console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 1c ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
  //   const renderersModulesWithSizes = await loadSizes(rendererModulesConverted);
  //   console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 1d ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
  //   const rendererModulesWithVersions = await loadVersions(renderersModulesWithSizes);
  //   result = rendererModulesWithVersions;
  //   console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 1e ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
  // } catch (error) {
  //   console.error(
  //     'getRenderModules: There was a problem creating the converted renderer modules w/ sizes and versions',
  //     JSON.stringify({ error }),
  //   );
  // }

  // return result;
  return getRenderRequireGraph()
    .then(createModules)
    .then(loadSizes)
    .then(loadVersions)
    .catch(error => {
      console.error(
        'getRenderModules: There was a problem creating the converted renderer modules w/ sizes and versions',
        JSON.stringify({ error }),
      );
    });
};

exports.getMainModules = async () => {
  // return getMainRequireGraph().then(createModules).then(loadSizes).then(loadVersions);
  let result;

  try {
    console.error('🚀--BLLR?: MAIN -> DEW EYE CEE DIS? 1a ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
    const mainModules = await getMainRequireGraph();
    console.error('🚀--BLLR?: MAIN -> DEW EYE CEE DIS? 1b ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
    const mainModulesConverted = await createModules(mainModules);
    console.error('🚀--BLLR?: MAIN -> DEW EYE CEE DIS? 1c ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
    const mainModulesWithSizes = await loadSizes(mainModulesConverted);
    console.error('🚀--BLLR?: MAIN -> DEW EYE CEE DIS? 1d ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
    const mainModulesWithVersions = await loadVersions(mainModulesWithSizes);
    result = mainModulesWithVersions;
    console.error('🚀--BLLR?: MAIN -> DEW EYE CEE DIS? 1e ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
  } catch (error) {
    console.error(
      'getMainModules: There was a problem creating the converted main modules w/ sizes and versions',
      { error },
    );
  }

  return result;
};
