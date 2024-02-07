export = EventListenerView;
declare class EventListenerView extends SelectableView {
    constructor(listener: any, parent: any);
    listener: any;
    handleEvents(parent: any): void;
    render(): void;
    filter(searchText: any): any;
}
import SelectableView = require("./selectable-view");
//# sourceMappingURL=event-listener-view.d.ts.map