'use strict';

class Module {
  constructor(path, resourcesPath, appName) {
    this.appName = appName;
    this.children = [];
    this.path = path;
    this.resourcesPath = resourcesPath;
    this.size = -1;
    this.version = '';
  }

  setVersion(version) {
    this.version = version;
    return this;
  }

  getVersion() {
    return this.version;
  }

  setSize(size) {
    this.size = size;
    return this;
  }

  getSize() {
    return this.size;
  }

  hasChildren() {
    return this.children.length > 0;
  }

  addChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  getPath() {
    return this.path;
  }

  getDepth() {
    let depth = 1;
    let parent = this.parent;
    while (parent != null) {
      depth++;
      parent = parent.parent;
    }
    return depth;
  }

  getName() {
    if (!this.name) {
      const namePath = /\/([^\/]+)$/.exec(this.path);

      // NOTE :: Might need to add checks for empty arrays, i.e. no length
      if (this.path === 'electron' && !namePath) {
        this.name = 'Electron';
      } else if (!namePath) {
        this.name = 'Unknown';
      } else {
        this.name = namePath[1];
      }
    }

    return this.name;
  }

  getDirectory() {
    if (!this.directoryPath) {
      let directoryPath = /(.+)\/[^\/]+$/.exec(this.path);

      // NOTE :: Might need to add checks for empty arrays, i.e. no length
      if (this.path === 'electron' && !directoryPath) {
        this.directoryPath = 'Base Electron Module';
      } else if (!directoryPath) {
        this.directoryPath = 'No directory path found';
      } else {
        this.directoryPath = directoryPath[1];
      }

      if (this.directoryPath.indexOf(this.resourcesPath) === 0) {
        this.directoryPath = this.directoryPath.substring(this.resourcesPath.length + 1);
      }
    }

    return this.directoryPath;
  }

  computeLibrary() {
    if (/\/atom\.asar\/(browser|common|renderer)\//.test(this.path)) return 'Electron';

    const libraryPattern = /\/node_modules\/([^\/]+)(?=\/)/g;
    let match = libraryPattern.exec(this.path);
    while (match != null) {
      let library = match[1];
      match = libraryPattern.exec(this.path);
      if (match == null) return library;
    }

    return this.appName;
  }

  getLibrary() {
    if (!this.library) this.library = this.computeLibrary();
    return this.library;
  }

  getId() {
    if (!this.id) this.id = this.getLibrary().toLowerCase();
    return this.id;
  }

  visit(callback) {
    callback(this);
    this.children.forEach(child => child.visit(callback));
  }

  toArray() {
    const modules = [];
    this.visit(module => modules.push(module));
    return modules;
  }
}

module.exports = Module;
