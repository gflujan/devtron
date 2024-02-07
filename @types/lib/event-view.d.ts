export = EventView;
declare class EventView extends ExpandableView {
    constructor(name: any, listeners: any, parent: any, table: any);
    name: any;
    count: any;
    parent: any;
    children: any;
    handleEvents(table: any): void;
    render(): void;
    filter(searchText: any): any;
}
import ExpandableView = require("./expandable-view");
//# sourceMappingURL=event-view.d.ts.map