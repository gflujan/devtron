export = Eval;
declare class Eval {
    static execute(expression: any, ...args: any[]): Promise<any>;
    static getFileSize(path: any): Promise<any>;
    static openExternal(urlToOpen: any): Promise<any>;
    static getFileVersion(filePath: any): Promise<any>;
    static isDebugMode(): Promise<any>;
    static isApiAvailable(): Promise<any>;
    static startServer(): Promise<any>;
    static proxyToServer(): void;
}
//# sourceMappingURL=eval.d.ts.map