"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OChainUtils = void 0;
const tslib_1 = require("tslib");
const shim = require("fabric-shim");
const util = require("util");
const fabric_shim_1 = require("fabric-shim");
const logger = shim.newLogger("OchainUtils");
logger.level = "debug";
class OChainUtils {
    constructor(stub) {
        this.stub = stub;
    }
    invokeChaincode(chaincodeName, methodName, args, channelName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            let result;
            result['isValid'] = true;
            if (chaincodeName && methodName && args) {
                if (!Array.isArray(args)) {
                    throw new Error("args parameters is not an array, expecting an array");
                }
                try {
                    let subCCArgs = [methodName];
                    subCCArgs = subCCArgs.concat(args.map((arg) => {
                        if (typeof arg !== "string") {
                            return JSON.stringify(arg);
                        }
                        return arg;
                    }));
                    let ccResult = yield self.stub.invokeChaincode(chaincodeName, subCCArgs, channelName);
                    if (ccResult) {
                        const message = util.format("successfully invoked method [%s] on sub-chaincode [%s] ", methodName, chaincodeName);
                        logger.info(message);
                        result['payload'] = JSON.parse(ccResult.payload.toString("utf8"));
                        result['message'] = message;
                    }
                    else {
                        throw new Error("No Result Found");
                    }
                }
                catch (error) {
                    let errorMessage = util.format("Error invoking sub-chaincode, detailed error: %s", error.message);
                    logger.error(errorMessage);
                    throw error;
                }
            }
            else {
                let errorMessage = util.format("Invalid arguments, expecting chaincodeName, methodName, args array and an optional channelName, however received, chaincodeName: %s, methodName: %s, args: %s, channelName: %s", chaincodeName, methodName, args, channelName);
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }
            return result;
        });
    }
    getAssetById(assetId, privateCollectionName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            const message = util.format("Getting asset with ID: %s\n", assetId);
            logger.info(message);
            let assetBytes = null;
            try {
                assetBytes = privateCollectionName ? yield self.stub.getPrivateData(privateCollectionName, assetId) : yield self.stub.getState(assetId);
            }
            catch (error) {
                let errorMessage = util.format("Error reading Asset with ID [%s]. Detailed Error: %s", assetId, error.message);
                logger.error(errorMessage);
                return new Error(errorMessage);
            }
            if (!assetBytes || assetBytes.length == 0) {
                let errorMessage = util.format("No Asset exists with ID [%s]", assetId);
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }
            const successMsg = util.format('Successfully fetched asset with ID [%s] from ledger', assetId);
            logger.info(successMsg);
            try {
                let assetJson = JSON.parse(assetBytes.toString());
                return assetJson;
            }
            catch (err) {
                logger.info("Asset is not JSON, returning raw asset as string");
                return assetBytes.toString();
            }
        });
    }
    createAsset(assetId, asset, extraHistoryColumns, callingUser, privateCollectionName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            return yield addUpdateAsset(self.stub, false, extraHistoryColumns, assetId, asset, true, callingUser ? callingUser : this.getObpRestUser(), privateCollectionName);
        });
    }
    updateAsset(assetId, asset, extraHistoryColumns, callingUser, privateCollectionName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            return yield addUpdateAsset(self.stub, false, extraHistoryColumns, assetId, asset, false, callingUser ? callingUser : this.getObpRestUser(), privateCollectionName);
        });
    }
    getAssetHistory(assetId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            const message = util.format("Getting History for asset: %s\n", assetId);
            logger.info(message);
            let resultsIterator, results;
            try {
                resultsIterator = yield self.stub.getHistoryForKey(assetId);
                results = yield getAllResults(resultsIterator, true);
                if (!results || results.length == 0) {
                    let errorMessage = util.format('No document exists with ID "%s"', assetId);
                    logger.error(errorMessage);
                    return errorMessage;
                }
            }
            catch (error) {
                let errorMessage = util.format('Error getting Asset History with ID "%s". Detailed Error: %s', assetId, error.message);
                logger.error(errorMessage);
                return errorMessage;
            }
            const successMsg = util.format("Successfully fetched Asset history with ID: %s", assetId);
            logger.info(successMsg);
            return results;
        });
    }
    getStateByRange(startKey, endKey) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            logger.info("Getting State By Range: \n");
            let resultsIterator, results;
            try {
                resultsIterator = yield self.stub.getStateByRange(startKey, endKey);
                results = yield getAllResults(resultsIterator, false);
                if (!results || results.length == 0) {
                    let errorMessage = util.format('No states exists with range between "%s and %s"', startKey, endKey);
                    logger.error(errorMessage);
                    return errorMessage;
                }
            }
            catch (error) {
                let errorMessage = util.format('Error getting states with range between %s and %s. Detailed Error: %s', startKey, endKey, error.message);
                logger.error(errorMessage);
                return errorMessage;
            }
            const message = util.format("Successfully fetched states with range between %s and %s: ", startKey, endKey);
            logger.info(message);
            return results;
        });
    }
    deleteAsset(assetId, privateCollectionName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            let result = {
                isValid: true
            };
            const message = util.format("Deleting asset with ID: %s", assetId);
            logger.info(message);
            yield self.getAssetById(assetId, privateCollectionName);
            try {
                privateCollectionName ? yield self.stub.deletePrivateData(privateCollectionName, assetId) : yield self.stub.deleteState(assetId);
            }
            catch (error) {
                let errorMessage = util.format("Error deleting Asset with ID [%s]. Detailed Error: %s", assetId, error.message);
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }
            result['message'] = util.format('Successfully deleted asset with ID [%s] from ledger', assetId);
            logger.info(result['message']);
            return result;
        });
    }
    queryAsset(query, privateCollectionName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let self = this;
            let resultsIterator, results;
            const message = util.format("About to execute query: [ %s ]", query);
            logger.info(message);
            try {
                resultsIterator = privateCollectionName ? yield self.stub.getPrivateDataQueryResult(privateCollectionName, query) : yield self.stub.getQueryResult(query);
                results = privateCollectionName ? yield getAllResults(resultsIterator.iterator, false) : yield getAllResults(resultsIterator, false);
            }
            catch (error) {
                let errorMessage = util.format("Error Querying Assets using query [ %s ]. Detailed Error: %s", query, error.message);
                logger.error(errorMessage);
                return errorMessage;
            }
            const successMsg = util.format("Query executed successfully, number of records returned: %s", results.length);
            logger.info(successMsg);
            return results;
        });
    }
    assertParamsExists(params, length) {
        let result = {
            isValid: true
        };
        if (!params || params.length != length) {
            let errorMessage = util.format("Invalid Parameters, expecting %s parameters but received %s", length, params.length);
            logger.error(errorMessage);
            result['isValid'] = false;
            result['message'] = errorMessage;
        }
        else {
            params.forEach(function (param) {
                if (param.length == 0) {
                    let errorMessage = util.format("Invalid Parameters, expecting %s non-empty parameter but received %s", length, JSON.stringify(params));
                    logger.error(errorMessage);
                    result['isValid'] = false;
                    result['message'] = errorMessage;
                }
            });
        }
        if (result.isValid) {
            const message = util.format("Received params %s are valid", JSON.stringify(params));
            logger.info(message);
        }
        return result;
    }
    assertTransientVarsExists(transientMapVars, keys) {
        let result = {
            isValid: true,
            message: []
        };
        if (!transientMapVars || Object.keys(transientMapVars).length == 0) {
            let errorMessage = util.format("Missing transient variables");
            logger.error(errorMessage);
            result.isValid = false;
            result.message.push(errorMessage);
        }
        else {
            if (!Array.isArray(keys)) {
                keys = [keys];
            }
            keys.forEach(key => {
                if (!transientMapVars.hasOwnProperty(key) || !transientMapVars[key]) {
                    let errorMessage = util.format("Missing required property %s", key);
                    logger.error(errorMessage);
                    result.isValid = false;
                    result.message.push(errorMessage);
                }
            });
        }
        if (result.isValid) {
            logger.info("Transient Variables Map is valid");
        }
        return result;
    }
    createLogger(loggerName) {
        const message = util.format("Creating new Logger with the Name: %s", loggerName);
        logger.info(message);
        let newLogger = shim.newLogger(loggerName);
        newLogger.level = "debug";
        return newLogger;
    }
    createCompositeKey(indexName, attributes) {
        if (!Array.isArray(attributes) || (Array.isArray(attributes) && !attributes.length)) {
            const errorMessage = '"attributes" param is expected to be an array of string.';
            logger.error(errorMessage);
            return new Error(errorMessage);
        }
        const compositeKey = this.stub.createCompositeKey(indexName, attributes);
        if (!compositeKey) {
            return new Error('Failed to create CompositeKey');
        }
        return compositeKey;
    }
    getAssetsFromPartialKey(iteratorObj, index) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const assets = [];
            while (true) {
                const queryResult = yield iteratorObj.next();
                if (queryResult.value) {
                    const parseKey = this.stub.splitCompositeKey(queryResult.value.key);
                    const assetId = parseKey.attributes[index];
                    assets.push(assetId);
                }
                if (queryResult.done) {
                    yield iteratorObj.close();
                    break;
                }
            }
            return assets;
        });
    }
    getStateByCompositeKey(key, columns, indexOfId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let resultsIterator;
            let assets;
            const results = [];
            try {
                if (!key) {
                    const errorMessage = 'Missing param "key" of type string.';
                    logger.error(errorMessage);
                    throw new Error(errorMessage);
                }
                if (!Array.isArray(columns) || (Array.isArray(columns) && !columns.length)) {
                    const errorMessage = '"columns" param is expected to be an array of string.';
                    logger.error(errorMessage);
                    throw new Error(errorMessage);
                }
                if (!indexOfId) {
                    const errorMessage = 'Missing param "indexOfId" of type number.';
                    logger.error(errorMessage);
                    throw new Error(errorMessage);
                }
                const idIndex = parseInt(indexOfId, 10);
                if (idIndex < 0 || !idIndex) {
                    const errorMessage = 'indexOfId should be greater than or equal to zero.';
                    logger.error(errorMessage);
                    throw new Error(errorMessage);
                }
                resultsIterator = yield this.stub.getStateByPartialCompositeKey(key, columns);
                if (resultsIterator instanceof Error) {
                    throw new Error('Error in returning iterator: ' + resultsIterator);
                }
                assets = yield this.getAssetsFromPartialKey(resultsIterator, idIndex);
            }
            catch (error) {
                const errorMessage = util.format('Error getting Assets with Composite Key. Detailed Error: %s', error.message);
                logger.error(errorMessage);
                return errorMessage;
            }
            for (const entity of assets) {
                try {
                    const asset = yield this.getAssetById(entity, undefined);
                    results.push(asset);
                }
                catch (error) {
                    const errorMessage = util.format('Error getting Assets with Composite Key. Detailed Error: %s', error.message);
                    logger.error(errorMessage);
                    return errorMessage;
                }
            }
            if (!results.length) {
                const errorMessage = util.format('No states exists with partial composite key %s', key);
                logger.error(errorMessage);
                return errorMessage;
            }
            return results;
        });
    }
    getNetworkStub() {
        return this.stub;
    }
    getTransactionInvoker() {
        return getTrxInvoker(this.stub, this.getObpRestUser());
    }
    getMspID() {
        let cid = new fabric_shim_1.ClientIdentity(this.stub);
        return cid.getMSPID();
    }
    getTransientMap() {
        const transient = this.getNetworkStub().getTransient();
        return transient;
    }
    getTransientVars() {
        const transientMap = this.getTransientMap();
        const result = {};
        if (transientMap && transientMap.map) {
            for (var key in transientMap.map) {
                result[key] = this.getTransientMapKey(key);
            }
        }
        return result;
    }
    getTransientMapKey(key) {
        const transient = this.getTransientMap();
        if (transient.map[key] && transient.map[key].value) {
            const buffer = new Buffer(transient.map[key].value.toArrayBuffer());
            const JSONString = buffer.toString("utf8");
            try {
                const asJson = JSON.parse(JSONString);
                return asJson;
            }
            catch (error) {
                const message = util.format("Transient Key [%s] is not JSON, returning string value", key);
                logger.info(message);
                return JSONString;
            }
        }
        else {
            return null;
        }
    }
    getObpRestUser() {
        return this.getTransientMapKey("bcsRestClientId");
    }
}
exports.OChainUtils = OChainUtils;
function addUpdateAsset(stub, addHistory, extraHistoryColumns, assetId, asset, isCreate, obpRestProxyUser, privateCollectionName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let result = {
            isValid: true
        };
        let loggerAction = isCreate ? "create" : "update";
        let assetBytes;
        const message = util.format("About to %s asset with ID: %s\n", loggerAction, assetId);
        logger.info(message);
        try {
            if (isCreate || addHistory) {
                assetBytes = privateCollectionName ? yield stub.getPrivateData(privateCollectionName, assetId) : yield stub.getState(assetId);
                if (isCreate) {
                    if (assetBytes && assetBytes.length > 0) {
                        let errorMessage = util.format("Error creating asset. Asset with ID [%s] already exists", assetId);
                        logger.error(errorMessage);
                        result['isValid'] = false;
                        result['payload'] = errorMessage;
                        return result;
                    }
                }
                else if (!assetBytes || assetBytes.length <= 0) {
                    let errorMessage = util.format("Error updating asset. Asset with ID [%s] doesn't exists", assetId);
                    logger.error(errorMessage);
                    result['isValid'] = false;
                    result['payload'] = errorMessage;
                    return result;
                }
            }
            if (addHistory) {
                let invoker = getTrxInvoker(stub, obpRestProxyUser);
                if (isCreate) {
                    asset.createdBy = {
                        user: invoker,
                        timeStamp: stub.getTxTimestamp().seconds.low,
                        trxId: stub.getTxID()
                    };
                    const lastModifiedEntry = {
                        userId: invoker,
                        timestamp: stub.getTxTimestamp().seconds.low,
                        action: "create",
                        trxId: stub.getTxID()
                    };
                    asset.lastModifiedBy = [lastModifiedEntry];
                }
                else {
                    let existingAsset = JSON.parse(assetBytes.toString());
                    asset.createdBy = existingAsset.createdBy;
                    asset.lastModifiedBy = existingAsset.lastModifiedBy;
                    if (!asset.lastModifiedBy || asset.lastModifiedBy.length == 0) {
                        asset.lastModifiedBy = [];
                    }
                    const lastModifiedEntry = {
                        userId: invoker,
                        timestamp: stub.getTxTimestamp().seconds.low,
                        action: "update",
                        trxId: stub.getTxID()
                    };
                    asset.lastModifiedBy.push(lastModifiedEntry);
                }
            }
            if (extraHistoryColumns) {
                asset['metadata'] = extraHistoryColumns;
            }
            if (privateCollectionName) {
                yield stub.putPrivateData(privateCollectionName, assetId, Buffer.from(JSON.stringify(asset)));
            }
            else {
                yield stub.putState(assetId, Buffer.from(JSON.stringify(asset)));
            }
            let message = util.format("Successfully %sd asset with ID %s", loggerAction, assetId);
            logger.info(message);
            result['payload'] = asset;
            result['message'] = message;
            return result;
        }
        catch (error) {
            let errorMessage = util.format('%s Asset with ID "%s" failed. Detailed Error: %s', loggerAction, assetId, error.message);
            logger.error(errorMessage);
            result['isValid'] = false;
            result['payload'] = errorMessage;
            return result;
        }
    });
}
function getTrxInvoker(stub, obpRestProxyUser) {
    let cid = new fabric_shim_1.ClientIdentity(stub);
    const message = util.format("Getting user identity for trx: %s", stub.getTxID());
    logger.info(message);
    const trxUserId = cid.getX509Certificate().subject.commonName;
    const mspId = cid.getMSPID();
    const id = obpRestProxyUser ? obpRestProxyUser : trxUserId;
    const user = {
        userId: id,
        orgId: mspId
    };
    const userMsg = util.format("Current user details are : %s", JSON.stringify(user));
    logger.info(userMsg);
    return user;
}
function getAllResults(iterator, isHistory) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let allResults = [];
        while (true) {
            let res = yield iterator.next();
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                if (isHistory && isHistory === true) {
                    jsonRes['trxId'] = res.value.tx_id;
                    jsonRes['timeStamp'] = res.value.timestamp.seconds.low;
                    jsonRes['isDelete'] = res.value.is_delete;
                    try {
                        jsonRes['value'] = JSON.parse(res.value.value.toString("utf8"));
                    }
                    catch (err) {
                        logger.error(err);
                        jsonRes['Value'] = res.value.value.toString("utf8");
                    }
                }
                else {
                    try {
                        const tempResult = JSON.parse(res.value.value.toString("utf8"));
                        for (let key in tempResult) {
                            try {
                                jsonRes[key] = JSON.parse(tempResult[key]);
                            }
                            catch (error) {
                                jsonRes[key] = tempResult[key];
                            }
                        }
                    }
                    catch (err) {
                        logger.error(err);
                        jsonRes = res.value.value.toString("utf8");
                    }
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                yield iterator.close();
                return allResults;
            }
        }
    });
}
//# sourceMappingURL=utils.js.map