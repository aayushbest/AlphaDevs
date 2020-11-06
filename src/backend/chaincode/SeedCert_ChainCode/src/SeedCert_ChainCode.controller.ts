/**
 *
 * Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
 *
 */
import * as yup from 'yup';
import { Validator } from '../lib/decorators';
import { OchainController } from '../lib/ochain-controller';
import { Myasset } from './SeedCert_ChainCode.model';

export class SeedCert_ChainCodeController extends OchainController {

    public async init(params: any) {
        return;
    }

    //-----------------------------------------------------------------------------
    //Myasset
    //-----------------------------------------------------------------------------

    @Validator(Myasset)
    public async createMyasset(asset: Myasset) {
        return await asset.save();
    }
    
    public async getMyassetById(id: string) {
        const asset = await Myasset.get(id);
        return asset;
    }
    
    @Validator(Myasset)
    public async updateMyasset(asset: Myasset) {
        return await asset.update();
    }
    
    public async deleteMyasset(id: string) {
        const result = await Myasset.delete(id);
        return result;
    }
    
    public async getMyassetHistoryById(id: string) {
        const result = await Myasset.history(id);
        return result;
    }
    
    @Validator(yup.string(), yup.string())
    public async getMyassetByRange(startId: string, endId: string) {
        const result = await Myasset.getByRange(startId, endId);
        return result;
    }
    

    //-----------------------------------------------------------------------------

}
