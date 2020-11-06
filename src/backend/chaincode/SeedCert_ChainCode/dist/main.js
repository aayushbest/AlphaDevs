"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chaincode_1 = require("./lib/chaincode");
const SeedCert_ChainCode_controller_1 = require("./src/SeedCert_ChainCode.controller");
chaincode_1.default({
    chainCodeName: 'SeedCert_ChainCode',
    chainCode: SeedCert_ChainCode_controller_1.SeedCert_ChainCodeController,
});
//# sourceMappingURL=main.js.map