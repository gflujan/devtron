'use strict';

const Humanize = require('humanize-plus');
const modules = require('./module-helpers');
const ModuleView = require('./module-view');
const View = require('./view');

class ModulesView extends View {
  constructor() {
    super('modules-view');
    this.handleEvents();
  }

  filterGraph() {
    const searchText = this.searchBox.value.toLowerCase();

    if (searchText) {
      this.rootRenderView.filter(searchText);
      this.rootMainView.filter(searchText);
    } else {
      this.rootRenderView.collapseAll();
      this.rootRenderView.expand();
      this.rootMainView.collapseAll();
      this.rootMainView.expand();
    }
  }

  focus() {
    if (this.mainProcessTable.classList.contains('hidden')) {
      this.renderRequireRows.focus();
    } else {
      this.mainRequireRows.focus();
    }
  }

  getTabLabelSuffix(modulesToHandle) {
    const count = modulesToHandle.count.toLocaleString();
    const size = Humanize.fileSize(modulesToHandle.totalSize);
    return `- ${count} files, ${size}`;
  }

  handleEvents() {
    this.loadButton.addEventListener('click', () => this.loadGraph());
    this.debounceInput(this.searchBox, () => this.filterGraph());

    this.mainProcessTab.addEventListener('click', () => {
      this.mainProcessTab.classList.add('active');
      this.renderProcessTab.classList.remove('active');

      this.mainProcessTable.classList.remove('hidden');
      this.renderProcessTable.classList.add('hidden');

      this.mainRequireRows.focus();
    });

    this.renderProcessTab.addEventListener('click', () => {
      this.mainProcessTab.classList.remove('active');
      this.renderProcessTab.classList.add('active');

      this.mainProcessTable.classList.add('hidden');
      this.renderProcessTable.classList.remove('hidden');

      this.renderRequireRows.focus();
    });
  }

  async loadGraph() {
    try {
      const rendererModules = await modules.getRenderModules();
      console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 2 ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
      this.tableDescription.classList.add('hidden');
      console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 3 ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
      const suffix = this.getTabLabelSuffix(rendererModules);
      console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 4 ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
      this.renderProcessTab.textContent = `Renderer Process ${suffix}`;
      console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 5 ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
      this.renderRequireRows.innerHTML = '';
      console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 6 ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!

      if (this.rootRenderView) {
        console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 7 ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
        this.rootRenderView.destroy();
      }

      console.error(
        '🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 8 ->',
        JSON.stringify(this.renderRequireRows),
      ); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
      this.rootRenderView = new ModuleView(rendererModules, this.renderRequireRows);
      console.error('🚀--BLLR?: RENDERER -> DEW EYE CEE DIS? 9 ->'); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
      this.rootRenderView.select();
    } catch (error) {
      console.error('ModulesView: Loading renderer modules failed');
      console.error(error.stack || error);
    }

    // TODO **[G]** :: Temporarily disabled to focus on `renderer` modules, re-enable when ready to work on these
    // modules
    //   .getMainModules()
    //   .then(mainModule => {
    //     const suffix = this.getTabLabelSuffix(mainModule);
    //     this.mainProcessTab.textContent = `Main Process ${suffix}`;
    //     this.mainRequireRows.innerHTML = '';
    //     if (this.rootMainView) this.rootMainView.destroy();
    //     this.rootMainView = new ModuleView(mainModule, this.mainRequireRows);
    //     this.rootMainView.select();
    //   })
    //   .catch(error => {
    //     console.error('ModulesView: Loading main modules failed');
    //     console.error(error.stack || error);
    //   });
  }

  reload() {
    this.loadGraph();
  }
}

module.exports = ModulesView;
