"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Myasset = void 0;
const tslib_1 = require("tslib");
const yup = require("yup");
const decorators_1 = require("../lib/decorators");
const ochain_model_1 = require("../lib/ochain-model");
let Myasset = (() => {
    let Myasset = class Myasset extends ochain_model_1.OchainModel {
        constructor() {
            super(...arguments);
            this.assetType = 'SeedCert_ChainCode.myasset';
        }
    };
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Myasset.prototype, "id", void 0);
    tslib_1.__decorate([
        decorators_1.Validate(yup.string()),
        tslib_1.__metadata("design:type", String)
    ], Myasset.prototype, "value", void 0);
    Myasset = tslib_1.__decorate([
        decorators_1.Id('id')
    ], Myasset);
    return Myasset;
})();
exports.Myasset = Myasset;
//# sourceMappingURL=SeedCert_ChainCode.model.js.map