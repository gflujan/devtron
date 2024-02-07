export = ModulesView;
declare class ModulesView extends View {
    constructor();
    handleEvents(): void;
    getTabLabelSuffix(mainModule: any): string;
    loadGraph(): void;
    rootRenderView: ModuleView;
    rootMainView: ModuleView;
    filterGraph(): void;
}
import View = require("./view");
import ModuleView = require("./module-view");
//# sourceMappingURL=modules-view.d.ts.map