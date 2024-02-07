export = SidebarView;
declare class SidebarView extends View {
    constructor();
    panes: any[];
    links: any[];
    panesElement: Element;
    handleEvents(): void;
    activateLink(name: any): void;
    addPane(view: any): void;
    activePane: any;
    findPane(name: any): any;
    selectPane(name: any): void;
    selectPrevious(): void;
    selectNext(): void;
}
import View = require("./view");
//# sourceMappingURL=sidebar-view.d.ts.map