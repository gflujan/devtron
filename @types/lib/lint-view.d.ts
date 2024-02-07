export = LintView;
declare class LintView extends View {
    constructor();
    highlightBlocks(): void;
    handleEvents(): void;
    updateAlert(alertElement: any, descriptionElement: any, passing: any): void;
    lint(): void;
    checkVersion(): void;
    currentVersion: any;
    checkLatestVersion(): void;
    latestVersion: any;
    updateVersion(): void;
}
import View = require("./view");
//# sourceMappingURL=lint-view.d.ts.map