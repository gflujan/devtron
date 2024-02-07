export = ExpandableView;
declare class ExpandableView extends SelectableView {
    toggleExpansion(): void;
    markExpanded(): void;
    expanded: boolean;
    expand(): void;
    markCollapsed(): void;
    collapse(): void;
    collapseAll(): void;
    listenForArrowClicks(): void;
    listenForExpanderKeys(emitter: any): void;
}
import SelectableView = require("./selectable-view");
//# sourceMappingURL=expandable-view.d.ts.map