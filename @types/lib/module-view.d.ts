export = ModuleView;
declare class ModuleView extends ExpandableView {
    constructor(module: any, table: any, parent: any);
    parent: any;
    module: any;
    table: any;
    children: any;
    handleEvents(): void;
    getHumanizedSize(): any;
    render(): void;
    filter(searchText: any): any;
}
import ExpandableView = require("./expandable-view");
//# sourceMappingURL=module-view.d.ts.map