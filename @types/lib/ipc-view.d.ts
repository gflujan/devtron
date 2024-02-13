export = IpcView;
declare class IpcView extends View {
    constructor();
    recording: boolean;
    handleEvents(): void;
    toggleHideInternal(): void;
    hideInternal: boolean;
    toggleRecording(): void;
    startRecording(): void;
    stopRecording(): void;
    openDocs(): void;
    clear(): void;
    addNewEvents(): void;
    timeoutId: NodeJS.Timeout;
    addEvent(event: any): void;
    filterIncomingEvent(view: any): void;
    filterEvents(): void;
    getFilterText(): any;
}
import View = require("./view");
//# sourceMappingURL=ipc-view.d.ts.map