"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedCert_ChainCodeController = void 0;
const tslib_1 = require("tslib");
const yup = require("yup");
const decorators_1 = require("../lib/decorators");
const ochain_controller_1 = require("../lib/ochain-controller");
const SeedCert_ChainCode_model_1 = require("./SeedCert_ChainCode.model");
let SeedCert_ChainCodeController = (() => {
    class SeedCert_ChainCodeController extends ochain_controller_1.OchainController {
        init(params) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return;
            });
        }
        createMyasset(asset) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield asset.save();
            });
        }
        getMyassetById(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const asset = yield SeedCert_ChainCode_model_1.Myasset.get(id);
                return asset;
            });
        }
        updateMyasset(asset) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield asset.update();
            });
        }
        deleteMyasset(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield SeedCert_ChainCode_model_1.Myasset.delete(id);
                return result;
            });
        }
        getMyassetHistoryById(id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield SeedCert_ChainCode_model_1.Myasset.history(id);
                return result;
            });
        }
        getMyassetByRange(startId, endId) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const result = yield SeedCert_ChainCode_model_1.Myasset.getByRange(startId, endId);
                return result;
            });
        }
    }
    tslib_1.__decorate([
        decorators_1.Validator(SeedCert_ChainCode_model_1.Myasset),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [SeedCert_ChainCode_model_1.Myasset]),
        tslib_1.__metadata("design:returntype", Promise)
    ], SeedCert_ChainCodeController.prototype, "createMyasset", null);
    tslib_1.__decorate([
        decorators_1.Validator(SeedCert_ChainCode_model_1.Myasset),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [SeedCert_ChainCode_model_1.Myasset]),
        tslib_1.__metadata("design:returntype", Promise)
    ], SeedCert_ChainCodeController.prototype, "updateMyasset", null);
    tslib_1.__decorate([
        decorators_1.Validator(yup.string(), yup.string()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], SeedCert_ChainCodeController.prototype, "getMyassetByRange", null);
    return SeedCert_ChainCodeController;
})();
exports.SeedCert_ChainCodeController = SeedCert_ChainCodeController;
//# sourceMappingURL=SeedCert_ChainCode.controller.js.map