const events = require('./event-helpers');
const EmitterView = require('./emitter-view');
const View = require('./view');

class EventsView extends View {
  static projectEmitters = {
    amI: 'here',
  };

  constructor() {
    console.debug('🚀--BLLR?: =================== START ===================');
    console.debug('DOES EVENTS VIEW HAVE A WINDOW? ->', window);
    console.debug('🚀--BLLR?: ==================== END ====================');
    super('events-view');
    this.children = [];
    this.handleEvents();
    console.error('BLLR?! WHEN ARE WE CREATING THE EVENTS VIEW???', EventsView.projectEmitters.amI);
  }

  static getProjectEmitters() {
    console.debug('🚀--BLLR?: events view GETTING the emitters ->', this.projectEmitters); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
    return this.projectEmitters;
  }

  static setProjectEmitters(projectEmitters) {
    this.projectEmitters = projectEmitters;
    console.debug('🚀--BLLR?: events view SETTING the emitters ->', this.getProjectEmitters()); // TODO **[G]** :: 🚀--BLLR?: REMOVE ME!!!
  }

  reload() {
    this.loadEvents();
  }

  focus() {
    this.listenersTable.focus();
  }

  handleEvents() {
    this.loadButton.addEventListener('click', () => this.loadEvents());
    this.debounceInput(this.searchBox, () => this.filterEvents());
  }

  filterEvents() {
    const searchText = this.searchBox.value.toLowerCase();
    if (searchText) {
      this.children.forEach(child => {
        child.filter(searchText);
      });
    } else {
      this.children.forEach(child => {
        child.show();
        child.collapse();
      });
    }
  }

  loadEvents() {
    events
      .getEvents()
      .then(events => {
        this.tableDescription.classList.add('hidden');
        this.listenersTable.innerHTML = '';
        this.destroyChildren();

        this.children = Object.keys(events).map(name => {
          return new EmitterView(name, events[name], this.listenersTable);
        });

        this.children[0].select();
      })
      .catch(error => {
        console.error('Getting event listeners failed');
        console.error(error.stack || error);
      });
  }
}

module.exports = EventsView;
