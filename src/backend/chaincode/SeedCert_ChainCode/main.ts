/**
 *
 * Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
 *
 */
import ChaincodeSDK from './lib/chaincode';
import { SeedCert_ChainCodeController } from './src/SeedCert_ChainCode.controller';

ChaincodeSDK({
    chainCodeName: 'SeedCert_ChainCode',
    chainCode: SeedCert_ChainCodeController,
});
