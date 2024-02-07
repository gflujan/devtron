export = AccessibilityView;
declare class AccessibilityView extends View {
    constructor();
    handleEvents(): void;
    audit(): void;
    render(results: any): void;
    openDocs(): void;
    filterAudits(): void;
    getFilterText(): any;
}
import View = require("./view");
//# sourceMappingURL=accessibility-view.d.ts.map