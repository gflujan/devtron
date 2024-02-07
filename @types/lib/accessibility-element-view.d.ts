export = AccessibilityElementView;
declare class AccessibilityElementView extends SelectableView {
    constructor(element: any, parent: any);
    path: any;
    pathId: any;
    handleEvents(parent: any): void;
    render(): void;
    filter(searchText: any): any;
}
import SelectableView = require("./selectable-view");
//# sourceMappingURL=accessibility-element-view.d.ts.map