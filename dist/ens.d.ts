export function getNamehash(name: any): string;
export class ENS {
    constructor({ networkId, registryAddress, provider }: {
        networkId: any;
        registryAddress: any;
        provider: any;
    });
    contracts: {
        42161: {
            registry: string;
        };
        421613: {
            registry: string;
        };
    };
    registryAddress: any;
    ENS: import("ethers").Contract;
    getENSContractInstance(): import("ethers").Contract;
    getOwner(name: any): Promise<any>;
    getResolver(name: any): Promise<any>;
    _getResolverObject(name: any): Promise<any>;
    getTTL(name: any): Promise<any>;
    getResolverWithLabelhash(labelhash: any, nodehash: any): Promise<any>;
    getOwnerWithLabelHash(labelhash: any, nodeHash: any): Promise<any>;
    getAddress(name: any): Promise<string>;
    getAddr(name: any, key: any): Promise<string>;
    getContent(name: any): Promise<"0x0000000000000000000000000000000000000000" | {
        value: any;
        contentType: string;
    }>;
    getText(name: any, key: any): Promise<any>;
    getName(address: any): Promise<{
        name: any;
    }>;
    isMigrated(name: any): Promise<any>;
    getResolverDetails(node: any): Promise<any>;
    getSubdomains(name: any): Promise<{
        label: null;
        labelhash: any;
        decrypted: boolean;
        node: any;
        name: string;
        owner: any;
    }[]>;
    getDomainDetails(name: any): Promise<any>;
    setOwner(name: any, newOwner: any): Promise<any>;
    setSubnodeOwner(name: any, newOwner: any): Promise<any>;
    setSubnodeRecord(name: any, newOwner: any, resolver: any): Promise<any>;
    setResolver(name: any, resolver: any): Promise<any>;
    setAddress(name: any, address: any): Promise<any>;
    setAddressWithResolver(name: any, address: any, resolverAddr: any): Promise<any>;
    setAddr(name: any, key: any, address: any): Promise<any>;
    setAddrWithResolver(name: any, key: any, address: any, resolverAddr: any): Promise<any>;
    setContent(name: any, content: any): Promise<any>;
    setContentWithResolver(name: any, content: any, resolverAddr: any): Promise<any>;
    setContenthash(name: any, content: any): Promise<any>;
    setContenthashWithResolver(name: any, content: any, resolverAddr: any): Promise<any>;
    setText(name: any, key: any, recordValue: any): Promise<any>;
    setTextWithResolver(name: any, key: any, recordValue: any, resolverAddr: any): Promise<any>;
    createSubdomain(name: any): Promise<any>;
    deleteSubdomain(name: any): Promise<any>;
    claimAndSetReverseRecordName(name: any, overrides?: {}): Promise<any>;
    setReverseRecordName(name: any): Promise<any>;
    supportsWildcard(name: any): Promise<any>;
    getENSEvent(event: any, { topics, fromBlock }: {
        topics: any;
        fromBlock: any;
    }): Promise<any>;
}
//# sourceMappingURL=ens.d.ts.map