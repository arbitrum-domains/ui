export function setupENS({ networkConfig, customProvider, ensAddress, reloadOnAccountsChange, enforceReadOnly, enforceReload, }?: {
    networkConfig: any;
    customProvider: any;
    ensAddress: any;
    reloadOnAccountsChange: any;
    enforceReadOnly: any;
    enforceReload: any;
}): Promise<{
    ens: ENS;
    registrar: import("./registrar").default;
    provider: any;
    network: any;
    providerObject: any;
}>;
export * from "./ens.js";
export * from "./registrar";
export * from "./web3";
export * from "./constants/interfaces";
export * from "./utils";
export * from "./contracts";
import { ENS } from "./ens.js";
export { utils, ethers } from "ethers";
//# sourceMappingURL=index.d.ts.map