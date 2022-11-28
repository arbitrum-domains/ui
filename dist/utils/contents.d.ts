export function decodeContenthash(encoded: any): {
    protocolType?: undefined;
    decoded?: undefined;
    error?: undefined;
} | {
    protocolType: null;
    decoded: any;
    error?: undefined;
} | {
    protocolType: string | undefined;
    decoded: any;
    error: any;
};
export function validateContent(encoded: any): any;
export function isValidContenthash(encoded: any): boolean | undefined;
export function getProtocolType(encoded: any): {
    protocolType: any;
    decoded: any;
} | undefined;
export function encodeContenthash(text: any): {
    encoded: boolean;
    error: string | undefined;
};
//# sourceMappingURL=contents.d.ts.map