export = Module;
declare class Module {
    constructor(path: any, resourcesPath: any, appName: any);
    path: any;
    resourcesPath: any;
    appName: any;
    size: number;
    version: string;
    children: any[];
    setVersion(version: any): this;
    getVersion(): string;
    setSize(size: any): this;
    getSize(): number;
    hasChildren(): boolean;
    addChild(child: any): void;
    getPath(): any;
    getDepth(): number;
    getName(): string;
    name: string;
    getDirectory(): string;
    computeLibrary(): any;
    getLibrary(): any;
    library: any;
    getId(): any;
    id: any;
    visit(callback: any): void;
    toArray(): any[];
}
//# sourceMappingURL=module.d.ts.map