"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OchainModel = void 0;
const tslib_1 = require("tslib");
const shim = require("fabric-shim");
const decorators_1 = require("./decorators");
const utils_1 = require("./utils");
const ochain_controller_1 = require("./ochain-controller");
const logger = shim.newLogger('OchainModel');
logger.level = 'debug';
class OchainModel {
    constructor(content) {
        const defaults = decorators_1.getDefaults(this);
        const filteredDefaults = Object.keys(defaults)
            .filter(key => !((key in content)))
            .reduce((obj, key) => {
            obj[key] = defaults[key];
            return obj;
        }, {});
        Object.assign(this, content, filteredDefaults);
        if (!decorators_1.checkMandatory(this)) {
            throw new Error('Fields missing!');
        }
    }
    toJSON(skipEmpty = false) {
        let self = this;
        let protoChain = [];
        do {
            self = Object.getPrototypeOf(self);
            protoChain.push(self);
        } while (self['__proto__'].constructor.name !== OchainModel.name);
        const descriptors = protoChain.reduce((result, proto) => [
            ...result,
            ...Object.keys(proto)
                .map(key => [key, Object.getOwnPropertyDescriptor(proto, key)])
        ], []);
        const base = Object.keys(this)
            .filter(k => !k.startsWith('_'))
            .filter(k => !skipEmpty || !(this[k] === undefined || this[k] === null))
            .reduce((result, key) => (Object.assign(Object.assign({}, result), { [key]: this[key] })), {});
        return descriptors
            .reduce((result, [key, desc]) => {
            const hasGetter = desc && typeof desc.get === 'function';
            if (hasGetter) {
                result[key] = desc.get.call(this);
            }
            if (skipEmpty && (result[key] === undefined || result[key] === null)) {
                delete result[key];
            }
            if (result[key] instanceof OchainModel) {
                result[key] = result[key].toJSON(true);
            }
            return result;
        }, base);
    }
    save(extraMetadata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!decorators_1.checkMandatory(this)) {
                throw new Error('Fields missing!');
            }
            const oChainUtil = new utils_1.OChainUtils(ochain_controller_1.OchainController.stubUtil);
            const transientMap = oChainUtil.getTransientVars();
            if (transientMap.hasOwnProperty('bcsRestClientId')) {
                delete transientMap['bcsRestClientId'];
            }
            const id = this['_pk'];
            const result = yield oChainUtil.createAsset(this[id], this, extraMetadata);
            if (result.isValid) {
                logger.info('OchainUtils returned valid result, returning payload');
                return result['payload'];
            }
            logger.info('OchainUtils returned invalid results, throwing an exception');
            throw new Error(result['payload']);
        });
    }
    static get(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const self = this;
            let assetId = id;
            if (Array.isArray(id) && id.length === 1) {
                assetId = id[0];
            }
            const oChainUtil = new utils_1.OChainUtils(ochain_controller_1.OchainController.stubUtil);
            const transientMap = oChainUtil.getTransientVars();
            if (transientMap.hasOwnProperty('bcsRestClientId')) {
                delete transientMap['bcsRestClientId'];
            }
            const type = self.name.toLowerCase();
            const result = yield oChainUtil.getAssetById(assetId);
            if (result.assetType &&
                result.assetType.includes('.') &&
                result.assetType.split('.')[0] === ochain_controller_1.OchainController.chaincodeName &&
                result.assetType.split('.')[1] === self.name.toLowerCase()) {
                const asset = new self(result);
                return asset;
            }
            throw new Error(`No Asset of type ${type} exists with ID [${id}]`);
        });
    }
    update(extraMetadata) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!decorators_1.checkMandatory(this)) {
                throw new Error('Fields missing!');
            }
            const oChainUtil = new utils_1.OChainUtils(ochain_controller_1.OchainController.stubUtil);
            const transientMap = oChainUtil.getTransientVars();
            if (transientMap.hasOwnProperty('bcsRestClientId')) {
                delete transientMap['bcsRestClientId'];
            }
            const id = this['_pk'];
            const result = yield oChainUtil.updateAsset(this[id], this, extraMetadata);
            if (result.isValid) {
                logger.info('OchainUtils returned valid result, returning payload');
                return result['payload'];
            }
            logger.info('OchainUtils returned invalid results, throwing an exception');
            throw new Error(result['payload']);
        });
    }
    static delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let assetId = id;
            if (Array.isArray(id) && id.length === 1) {
                assetId = id[0];
            }
            const oChainUtil = new utils_1.OChainUtils(ochain_controller_1.OchainController.stubUtil);
            const transientMap = oChainUtil.getTransientVars();
            if (transientMap.hasOwnProperty('bcsRestClientId')) {
                delete transientMap['bcsRestClientId'];
            }
            const result = yield oChainUtil.deleteAsset(assetId);
            return result;
        });
    }
    static history(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let assetId = id;
            if (Array.isArray(id) && id.length === 1) {
                assetId = id[0];
            }
            const oChainUtil = new utils_1.OChainUtils(ochain_controller_1.OchainController.stubUtil);
            const transientMap = oChainUtil.getTransientVars();
            if (transientMap.hasOwnProperty('bcsRestClientId')) {
                delete transientMap['bcsRestClientId'];
            }
            const result = yield oChainUtil.getAssetHistory(assetId);
            return result;
        });
    }
    static getByRange(startId, endId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const self = this;
            const oChainUtil = new utils_1.OChainUtils(ochain_controller_1.OchainController.stubUtil);
            const transientMap = oChainUtil.getTransientVars();
            if (transientMap.hasOwnProperty('bcsRestClientId')) {
                delete transientMap['bcsRestClientId'];
            }
            const assets = [];
            const values = [];
            const results = yield oChainUtil.getStateByRange(startId, endId);
            for (const entity of results) {
                if (entity.assetType &&
                    entity.assetType.includes('.') &&
                    entity.assetType.split('.')[0] === ochain_controller_1.OchainController.chaincodeName &&
                    entity.assetType.split('.')[1] === self.name.toLowerCase()) {
                    values.push(entity);
                }
            }
            for (const value of values) {
                assets.push(new self(value));
            }
            return assets;
        });
    }
}
exports.OchainModel = OchainModel;
//# sourceMappingURL=ochain-model.js.map