export = EmitterView;
declare class EmitterView extends ExpandableView {
    constructor(name: any, listeners: any, table: any);
    name: any;
    count: any;
    children: EventView[];
    handleEvents(table: any): void;
    render(): void;
    filter(searchText: any): any;
}
import ExpandableView = require("./expandable-view");
import EventView = require("./event-view");
//# sourceMappingURL=emitter-view.d.ts.map