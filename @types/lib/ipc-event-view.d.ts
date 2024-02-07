export = IpcEventView;
declare class IpcEventView extends SelectableView {
    constructor(event: any, table: any);
    event: any;
    internalEvent: any;
    render(): void;
    filter(searchText: any): void;
}
import SelectableView = require("./selectable-view");
//# sourceMappingURL=ipc-event-view.d.ts.map