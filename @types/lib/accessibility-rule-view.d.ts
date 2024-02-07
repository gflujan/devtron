export = AccessibilityRuleView;
declare class AccessibilityRuleView extends ExpandableView {
    constructor(rule: any, table: any);
    rule: any;
    count: any;
    children: any;
    handleEvents(table: any): void;
    render(): void;
    filter(searchText: any): any;
}
import ExpandableView = require("./expandable-view");
//# sourceMappingURL=accessibility-rule-view.d.ts.map