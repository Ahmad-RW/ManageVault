declare class TokenStorage {
    private static readonly initializedFlag;
    private static readonly tokenStoragePrefix;
    private static sessionStorage;
    private static window;
    static storeToken(continuationToken: string, productId: string): void;
    static getStoredToken(productId: string): any;
    static initialize(): void;
    static clear(): void;
    private static getKeyName;
    private static readonly canStore;
}
export { TokenStorage };
