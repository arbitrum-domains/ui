export default DNSRegistrar;
declare class DNSRegistrar {
    constructor(oracleAddress: any, isOld?: boolean);
    oracleAddress: any;
    isOld: boolean;
    OracleClass: typeof OldOracle | typeof NewOracle;
    /**
     * returns a claim object which allows you to claim
     * the ownership of a given name on ENS by submitting the proof
     * into DNSSEC oracle as well as claiming the name via the registrar
     * @param {string} name - name of the domain you want to claim
     */
    claim(name: string): Promise<Claim>;
}
import { Oracle as OldOracle } from "@ensdomains/dnssecoraclejs-017";
import { Oracle as NewOracle } from "@ensdomains/dnssecoraclejs";
declare class Claim {
    constructor({ oracle, isFound, result, textDomain, encodedName }: {
        oracle: any;
        isFound: any;
        result: any;
        textDomain: any;
        encodedName: any;
    });
    oracle: any;
    result: any;
    isFound: any;
    textDomain: any;
    encodedName: any;
    getProofData(): Promise<any>;
    /**
     * returns `Oracle <https://dnsprovejs.readthedocs.io/en/latest/libraries.html#oracle>`_ object
     */
    getOracle(): any;
    /**
     * returns `DnsResult <https://dnsprovejs.readthedocs.io/en/latest/libraries.html#dnsresult>`_ object
     */
    getResult(): any;
    /**
     * returns owner ETH address from the DNS record.
     */
    getOwner(): any;
}
//# sourceMappingURL=dnsregistrar.d.ts.map