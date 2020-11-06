/**
 *
 * Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
 *
 */
import * as shim from 'fabric-shim';
import { OChainUtils } from './utils';

const logger = shim.newLogger('OchainController');
logger.level = 'debug';

export abstract class OchainController {
    public static stubUtil: any;
    public static chaincodeName: string;

    private oChainUtil: any;

    constructor() {
        this.oChainUtil = new OChainUtils(OchainController.stubUtil);
    }

    public async getAssetById(id: string) {
        let assetId = id;
        if (Array.isArray(id) && id.length === 1) {
            assetId = id[0];
        }
        // Remove OBP REST user
        const transientMap = this.oChainUtil.getTransientVars();
        if (transientMap.hasOwnProperty('bcsRestClientId')) {
            delete transientMap['bcsRestClientId'];
        }

        // @ts-ignore
        const result = await this.oChainUtil.getAssetById(assetId);
        return result;
    }

    public async getAssetsByRange(startId: string, endId: string) {
        // Remove OBP REST user
        const transientMap = this.oChainUtil.getTransientVars();
        if (transientMap.hasOwnProperty('bcsRestClientId')) {
            delete transientMap['bcsRestClientId'];
        }

        // @ts-ignore
        const result = await this.oChainUtil.getStateByRange(startId, endId);
        return result;
    }

    public async getAssetHistoryById(id: string) {
        let assetId = id;
        if (Array.isArray(id) && id.length === 1) {
            assetId = id[0];
        }
        // Remove OBP REST user
        const transientMap = this.oChainUtil.getTransientVars();
        if (transientMap.hasOwnProperty('bcsRestClientId')) {
            delete transientMap['bcsRestClientId'];
        }

        // @ts-ignore
        const result = await this.oChainUtil.getAssetHistory(assetId);
        return result;
    }

    public async query(query: string) {
        // Remove OBP REST user
        const transientMap = this.oChainUtil.getTransientVars();
        if (transientMap.hasOwnProperty('bcsRestClientId')) {
            delete transientMap['bcsRestClientId'];
        }

        // @ts-ignore
        const result = await this.oChainUtil.queryAsset(query);
        return result;
    }

    public generateCompositeKey(indexName: string, attributes: string[]) {
        return this.oChainUtil.createCompositeKey(indexName, attributes);
    }

    public async getByCompositeKey(key: string, columns: string[], indexOfId: number) {
        // Remove OBP REST user
        const transientMap = this.oChainUtil.getTransientVars();
        if (transientMap.hasOwnProperty('bcsRestClientId')) {
            delete transientMap['bcsRestClientId'];
        }

        // @ts-ignore
        const result = await this.oChainUtil.getStateByCompositeKey(key, columns, indexOfId);
        return result;
    }

    public getTransactionId() {
        return this.oChainUtil.getNetworkStub().getTxID();
    }

    public getTransactionTimestamp() {
        return this.oChainUtil.getNetworkStub().getTxTimestamp();
    }

    public getTransactionInvoker() {
        return this.oChainUtil.getTransactionInvoker();
    }

    public getChannelID() {
        return this.oChainUtil.getNetworkStub().getChannelID();
    }

    public getCreator() {
        return this.oChainUtil.getNetworkStub().getCreator();
    }

    public getSignedProposal() {
        return this.oChainUtil.getNetworkStub().getSignedProposal();
    }

    public getArgs() {
        return this.oChainUtil.getNetworkStub().getArgs();
    }

    public getStringArgs() {
        return this.oChainUtil.getNetworkStub().getStringArgs();
    }

    public getMspID() {
        return this.oChainUtil.getMspID();
    }

    public getNetworkStub() {
        return this.oChainUtil.getNetworkStub();
    }
}
