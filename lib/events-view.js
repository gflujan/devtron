const eventHelpers = require('./event-helpers');
const EmitterView = require('./emitter-view');
const View = require('./view');

class EventsView extends View {
  constructor() {
    super('events-view');
    this.children = [];
    this.handleEvents();
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

  async loadEvents() {
    try {
      const events = await eventHelpers.getEvents();

      if (events) {
        this.tableDescription.classList.add('hidden');
        this.listenersTable.innerHTML = '';
        this.destroyChildren();

        this.children = Object.keys(events).map(name => {
          return new EmitterView(name, events[name], this.listenersTable);
        });

        this.children[0].select();
      } else {
        console.error("EventsView: Loading events didn't receive anything. Ignoring.");
      }
    } catch (error) {
      console.error('EventsView: Getting event listeners failed.');
      console.error(error.stack || error);
    }
  }
}

module.exports = EventsView;
