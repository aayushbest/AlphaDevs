/**
 *
 * Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
 *
 */
import * as shim from 'fabric-shim';
import * as util from 'util';
import { OchainController } from './ochain-controller';

const logger = shim.newLogger('ochain');
logger.level = 'debug';

export class ChainCode {
    private chainCodeName: string;
    private chainCode: any;

    constructor(props) {
        this.chainCodeName = props.chainCodeName;
        this.chainCode = props.chainCode;
    }

    /*
     * Chaincode INIT Method
     */
    async Init(stub) {
        const message = util.format('Started chaincode "%s" initialization', this.chainCodeName);
        logger.info(message);

        try {
            let funcAndParams = stub.getFunctionAndParameters();
            let fcn = 'init'; // name of method to execute
            let params = funcAndParams.params; // method params
            let payload = await this.executeMethod(stub, fcn, params);
            payload = payload ? payload : '';
            if (typeof payload == "object") {
                payload = JSON.stringify(payload);
            }
            return shim.success(Buffer.from(payload));
        } catch (err) {
            return shim.error(err);
        }
    }

    /*
     * Chaincode Invoke Method
     */
    async Invoke(stub) {

        try {
            let funcAndParams = stub.getFunctionAndParameters();
            let fcn = funcAndParams.fcn; // name of method to execute
            let params = funcAndParams.params; // method params
            let payload = await this.executeMethod(stub, fcn, params);
            payload = payload ? payload : '';
            if (typeof payload == "object") {
                payload = JSON.stringify(payload);
            }
            return shim.success(Buffer.from(payload));
        } catch (err) {
            return shim.error(err.message);
        }
    }

    async executeMethod(stub, fcn, params) {
        // invoke method
        try {
            const message = util.format('Invoking method [%s] with the following parameters [%s]', fcn, params);
            logger.info(message);

            OchainController.stubUtil = stub;
            OchainController.chaincodeName = this.chainCodeName;

            // get method
            const chaincode = new this.chainCode();
            const method = chaincode[fcn];
            if (!method) {
                const error = util.format("No function with the name [%s] exists", fcn);
                logger.error(error);
                throw new Error(error);
            }

            const payload = await method.call(chaincode, params);
            return payload;
        } catch (err) {
            logger.error(err);
            throw new Error(err.message);
        }
    }
}

export default function ChaincodeSDK(props) {
    if (props.hasOwnProperty('chainCodeName') &&
        props.hasOwnProperty('chainCode')) {
        shim.start(new ChainCode(props));
    } else {
        let errorMessage = util.format(
            'Invalid properties passed in, expecting {chainCodeName : "NAME OF CHAINCODE" , chainCode: "CHAINCODE_IMPL_CLASS"}');
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }
}
