"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OchainController = void 0;
const tslib_1 = require("tslib");
const shim = require("fabric-shim");
const utils_1 = require("./utils");
const logger = shim.newLogger('OchainController');
logger.level = 'debug';
class OchainController {
    constructor() {
        this.oChainUtil = new utils_1.OChainUtils(OchainController.stubUtil);
    }
    getAssetById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let assetId = id;
            if (Array.isArray(id) && id.length === 1) {
                assetId = id[0];
            }
            const transientMap = this.oChainUtil.getTransientVars();
            if (transientMap.hasOwnProperty('bcsRestClientId')) {
                delete transientMap['bcsRestClientId'];
            }
            const result = yield this.oChainUtil.getAssetById(assetId);
            return result;
        });
    }
    getAssetsByRange(startId, endId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const transientMap = this.oChainUtil.getTransientVars();
            if (transientMap.hasOwnProperty('bcsRestClientId')) {
                delete transientMap['bcsRestClientId'];
            }
            const result = yield this.oChainUtil.getStateByRange(startId, endId);
            return result;
        });
    }
    getAssetHistoryById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let assetId = id;
            if (Array.isArray(id) && id.length === 1) {
                assetId = id[0];
            }
            const transientMap = this.oChainUtil.getTransientVars();
            if (transientMap.hasOwnProperty('bcsRestClientId')) {
                delete transientMap['bcsRestClientId'];
            }
            const result = yield this.oChainUtil.getAssetHistory(assetId);
            return result;
        });
    }
    query(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const transientMap = this.oChainUtil.getTransientVars();
            if (transientMap.hasOwnProperty('bcsRestClientId')) {
                delete transientMap['bcsRestClientId'];
            }
            const result = yield this.oChainUtil.queryAsset(query);
            return result;
        });
    }
    generateCompositeKey(indexName, attributes) {
        return this.oChainUtil.createCompositeKey(indexName, attributes);
    }
    getByCompositeKey(key, columns, indexOfId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const transientMap = this.oChainUtil.getTransientVars();
            if (transientMap.hasOwnProperty('bcsRestClientId')) {
                delete transientMap['bcsRestClientId'];
            }
            const result = yield this.oChainUtil.getStateByCompositeKey(key, columns, indexOfId);
            return result;
        });
    }
    getTransactionId() {
        return this.oChainUtil.getNetworkStub().getTxID();
    }
    getTransactionTimestamp() {
        return this.oChainUtil.getNetworkStub().getTxTimestamp();
    }
    getTransactionInvoker() {
        return this.oChainUtil.getTransactionInvoker();
    }
    getChannelID() {
        return this.oChainUtil.getNetworkStub().getChannelID();
    }
    getCreator() {
        return this.oChainUtil.getNetworkStub().getCreator();
    }
    getSignedProposal() {
        return this.oChainUtil.getNetworkStub().getSignedProposal();
    }
    getArgs() {
        return this.oChainUtil.getNetworkStub().getArgs();
    }
    getStringArgs() {
        return this.oChainUtil.getNetworkStub().getStringArgs();
    }
    getMspID() {
        return this.oChainUtil.getMspID();
    }
    getNetworkStub() {
        return this.oChainUtil.getNetworkStub();
    }
}
exports.OchainController = OchainController;
//# sourceMappingURL=ochain-controller.js.map