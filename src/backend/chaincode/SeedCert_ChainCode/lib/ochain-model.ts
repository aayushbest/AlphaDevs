/**
 *
 * Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
 *
 */
import * as shim from 'fabric-shim';
import { checkMandatory, getDefaults } from './decorators';
import { OChainUtils } from './utils';
import { OchainController } from './ochain-controller';

const logger = shim.newLogger('OchainModel');
logger.level = 'debug';

export abstract class OchainModel<T extends OchainModel<any>> {
    constructor(content: any) {
        const defaults = getDefaults(this);
        const filteredDefaults = Object.keys(defaults)
          .filter(key => !((key in content)))
          .reduce((obj, key) => {
            obj[key] = defaults[key];
            return obj;
        }, {});
        Object.assign(this, content, filteredDefaults);
        if (!checkMandatory(this)) {
            throw new Error('Fields missing!');
        }
    }

    public toJSON(skipEmpty = false) {
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
          .reduce((result, key) => ({ ...result, [key]: this[key] }), {});

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

    public async save(extraMetadata?: any) {
        if (!checkMandatory(this)) {
            throw new Error('Fields missing!');
        }

        const oChainUtil = new OChainUtils(OchainController.stubUtil);
        // Remove OBP REST user
        const transientMap = oChainUtil.getTransientVars();
        if (transientMap.hasOwnProperty('bcsRestClientId')) {
            delete transientMap['bcsRestClientId'];
        }

        const id = this['_pk'];

        // @ts-ignore
        const result = await oChainUtil.createAsset(this[id], this, extraMetadata);

        if (result.isValid) {
            logger.info('OchainUtils returned valid result, returning payload');
            return result['payload'];
        }

        logger.info('OchainUtils returned invalid results, throwing an exception');
        throw new Error(result['payload']);
    }

    public static async get<T extends OchainModel<any>>(this: new (obj: any) => T, id: any) {
        const self = this;
        let assetId = id;
        if (Array.isArray(id) && id.length === 1) {
            assetId = id[0];
        }

        const oChainUtil = new OChainUtils(OchainController.stubUtil);
        // Remove OBP REST user
        const transientMap = oChainUtil.getTransientVars();
        if (transientMap.hasOwnProperty('bcsRestClientId')) {
            delete transientMap['bcsRestClientId'];
        }

        const type = self.name.toLowerCase();
        // @ts-ignore
        const result = await oChainUtil.getAssetById(assetId);
        if (result.assetType &&
            result.assetType.includes('.') &&
            result.assetType.split('.')[0] === OchainController.chaincodeName &&
            result.assetType.split('.')[1] === self.name.toLowerCase()) {
            const asset = new self(result);
            return asset;
        }

        throw new Error(`No Asset of type ${type} exists with ID [${id}]`);
    }

    public async update(extraMetadata?: any) {
        if (!checkMandatory(this)) {
            throw new Error('Fields missing!');
        }

        const oChainUtil = new OChainUtils(OchainController.stubUtil);
        // Remove OBP REST user
        const transientMap = oChainUtil.getTransientVars();
        if (transientMap.hasOwnProperty('bcsRestClientId')) {
            delete transientMap['bcsRestClientId'];
        }

        const id = this['_pk'];

        // @ts-ignore
        const result = await oChainUtil.updateAsset(this[id], this, extraMetadata);

        if (result.isValid) {
            logger.info('OchainUtils returned valid result, returning payload');
            return result['payload'];
        }

        logger.info('OchainUtils returned invalid results, throwing an exception');
        throw new Error(result['payload']);
    }

    public static async delete(id: any) {
        let assetId = id;
        if (Array.isArray(id) && id.length === 1) {
            assetId = id[0];
        }

        const oChainUtil = new OChainUtils(OchainController.stubUtil);
        // Remove OBP REST user
        const transientMap = oChainUtil.getTransientVars();
        if (transientMap.hasOwnProperty('bcsRestClientId')) {
            delete transientMap['bcsRestClientId'];
        }

        // @ts-ignore
        const result = await oChainUtil.deleteAsset(assetId);
        return result;
    }

    public static async history(id: any) {
        let assetId = id;
        if (Array.isArray(id) && id.length === 1) {
            assetId = id[0];
        }

        const oChainUtil = new OChainUtils(OchainController.stubUtil);
        // Remove OBP REST user
        const transientMap = oChainUtil.getTransientVars();
        if (transientMap.hasOwnProperty('bcsRestClientId')) {
            delete transientMap['bcsRestClientId'];
        }

        // @ts-ignore
        const result = await oChainUtil.getAssetHistory(assetId);
        return result;
    }

    // tslint:disable-next-line: max-line-length
    public static async getByRange<T extends OchainModel<any>>(this: new (obj: any) => T, startId: string, endId: string) {
        const self = this;
        const oChainUtil = new OChainUtils(OchainController.stubUtil);
        // Remove OBP REST user
        const transientMap = oChainUtil.getTransientVars();
        if (transientMap.hasOwnProperty('bcsRestClientId')) {
            delete transientMap['bcsRestClientId'];
        }

        const assets = [];
        const values = [];
        // @ts-ignore
        const results = await oChainUtil.getStateByRange(startId, endId);
        for (const entity of results) {
            if (entity.assetType &&
                entity.assetType.includes('.') &&
                entity.assetType.split('.')[0] === OchainController.chaincodeName  &&
                entity.assetType.split('.')[1] === self.name.toLowerCase()) {
                values.push(entity);
            }
        }
        for (const value of values) {
            assets.push(new self(value));
        }
        return assets;
    }
}
