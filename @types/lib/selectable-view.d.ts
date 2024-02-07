export = SelectableView;
declare class SelectableView extends View {
    select(): void;
    selected: boolean;
    deselect(): void;
    selectNext(): void;
    selectPrevious(): void;
    listenForSelection(emitter: any): void;
    listenForSelectionKeys(emitter: any): void;
}
import View = require("./view");
//# sourceMappingURL=selectable-view.d.ts.map