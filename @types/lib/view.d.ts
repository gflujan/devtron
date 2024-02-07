export = View;
declare class View {
    static queryForEach(element: any, selector: any, callback: any): void;
    constructor(viewId: any);
    id: any;
    listeners: any[];
    element: any;
    destroy(): void;
    destroyChildren(): void;
    children: any[];
    bindFields(): void;
    bindListener(emitter: any, event: any, callback: any): void;
    createElement(): any;
    isHidden(): any;
    hide(): void;
    show(): void;
    focus(): void;
    debounceInput(emitter: any, callback: any): void;
    debounceEvent(emitter: any, eventName: any, interval: any, callback: any): void;
    reload(): void;
}
//# sourceMappingURL=view.d.ts.map