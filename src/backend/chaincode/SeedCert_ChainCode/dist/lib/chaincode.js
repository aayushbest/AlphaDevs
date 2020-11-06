"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainCode = void 0;
const tslib_1 = require("tslib");
const shim = require("fabric-shim");
const util = require("util");
const ochain_controller_1 = require("./ochain-controller");
const logger = shim.newLogger('ochain');
logger.level = 'debug';
class ChainCode {
    constructor(props) {
        this.chainCodeName = props.chainCodeName;
        this.chainCode = props.chainCode;
    }
    Init(stub) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const message = util.format('Started chaincode "%s" initialization', this.chainCodeName);
            logger.info(message);
            try {
                let funcAndParams = stub.getFunctionAndParameters();
                let fcn = 'init';
                let params = funcAndParams.params;
                let payload = yield this.executeMethod(stub, fcn, params);
                payload = payload ? payload : '';
                if (typeof payload == "object") {
                    payload = JSON.stringify(payload);
                }
                return shim.success(Buffer.from(payload));
            }
            catch (err) {
                return shim.error(err);
            }
        });
    }
    Invoke(stub) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let funcAndParams = stub.getFunctionAndParameters();
                let fcn = funcAndParams.fcn;
                let params = funcAndParams.params;
                let payload = yield this.executeMethod(stub, fcn, params);
                payload = payload ? payload : '';
                if (typeof payload == "object") {
                    payload = JSON.stringify(payload);
                }
                return shim.success(Buffer.from(payload));
            }
            catch (err) {
                return shim.error(err.message);
            }
        });
    }
    executeMethod(stub, fcn, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const message = util.format('Invoking method [%s] with the following parameters [%s]', fcn, params);
                logger.info(message);
                ochain_controller_1.OchainController.stubUtil = stub;
                ochain_controller_1.OchainController.chaincodeName = this.chainCodeName;
                const chaincode = new this.chainCode();
                const method = chaincode[fcn];
                if (!method) {
                    const error = util.format("No function with the name [%s] exists", fcn);
                    logger.error(error);
                    throw new Error(error);
                }
                const payload = yield method.call(chaincode, params);
                return payload;
            }
            catch (err) {
                logger.error(err);
                throw new Error(err.message);
            }
        });
    }
}
exports.ChainCode = ChainCode;
function ChaincodeSDK(props) {
    if (props.hasOwnProperty('chainCodeName') &&
        props.hasOwnProperty('chainCode')) {
        shim.start(new ChainCode(props));
    }
    else {
        let errorMessage = util.format('Invalid properties passed in, expecting {chainCodeName : "NAME OF CHAINCODE" , chainCode: "CHAINCODE_IMPL_CLASS"}');
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }
}
exports.default = ChaincodeSDK;
//# sourceMappingURL=chaincode.js.map