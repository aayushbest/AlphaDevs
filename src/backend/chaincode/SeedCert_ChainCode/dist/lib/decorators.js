"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = exports.Validate = exports.Id = exports.getDefaults = exports.Default = exports.checkMandatory = exports.Mandatory = exports.isSchema = exports.allowMetadataKey = exports.mandatoryMetadataKey = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const yup_1 = require("yup");
exports.mandatoryMetadataKey = Symbol('mandatory');
exports.allowMetadataKey = Symbol('default');
exports.isSchema = (schema) => 'validate' in schema;
function Mandatory() {
    return (target, key) => {
        const required = Reflect.getMetadata(exports.mandatoryMetadataKey, target);
        Reflect.defineMetadata(exports.mandatoryMetadataKey, Object.assign(Object.assign({}, required), { [key]: true }), target);
    };
}
exports.Mandatory = Mandatory;
function checkMandatory(obj) {
    let mandatory = {};
    try {
        mandatory = Reflect.getMetadata(exports.mandatoryMetadataKey, obj) || {};
    }
    catch (e) {
    }
    return Object.keys(mandatory)
        .every(k => {
        const res = !mandatory[k] || obj[k] !== undefined;
        if (!res) {
            throw new Error(`Field '${k}' is mandatory but was not found.`);
        }
        return res;
    });
}
exports.checkMandatory = checkMandatory;
function Default(defaultValue) {
    return (target, key) => {
        const defaults = Reflect.getMetadata(exports.allowMetadataKey, target) || {};
        Reflect.defineMetadata(exports.allowMetadataKey, Object.assign(Object.assign({}, defaults), { [key]: defaultValue }), target);
    };
}
exports.Default = Default;
function getDefaults(obj) {
    const defaults = Reflect.getMetadata(exports.allowMetadataKey, obj);
    return !defaults ? {} : Object.keys(defaults)
        .reduce((result, k) => (Object.assign(Object.assign({}, result), { [k]: typeof defaults[k] === 'function' ? defaults[k]() : defaults[k] })), {});
}
exports.getDefaults = getDefaults;
function Id(name) {
    return (constructor) => {
        constructor.prototype._pk = name;
    };
}
exports.Id = Id;
function Validate(input) {
    const schema = input;
    return (target, key) => {
        const getterSetter = {
            get() {
                return this[`_${key}`];
            },
            set(value) {
                let setMethod = target.__lookupSetter__(key);
                setMethod = !setMethod || setMethod === getterSetter.set ? (val => val) : setMethod;
                try {
                    this[`_${key}`] = schema.validateSync(setMethod.call(this, value));
                }
                catch (ex) {
                    throw new Error(`Error in field '${key}' with value '${JSON.stringify(value)}': ${ex.message}`);
                }
            },
            enumerable: true,
            configurable: true,
        };
        Object.defineProperty(target, key, getterSetter);
    };
}
exports.Validate = Validate;
function Validator(...models) {
    return (target, key, descriptor) => {
        const originalFunc = descriptor.value;
        if (typeof originalFunc !== 'function') {
            throw new Error('Validator controller function is invalid');
        }
        const schemas = models.map(model => [exports.isSchema(model) ? model : yup_1.object()
                .transform(val => val instanceof model ? val : new model(val)), !exports.isSchema(model) && model]);
        descriptor.value = function newFunc(args) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (schemas) {
                    args = yield schemas.reduce((obj, [schema, model], i) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        let params;
                        try {
                            params = yield schema.validate(args[i]);
                        }
                        catch (e) {
                            throw new Error('Validation of arguments failed: ' + e);
                        }
                        if (model) {
                            try {
                                params = new model(JSON.parse(args[i]));
                            }
                            catch (e) {
                                throw new Error('JSON parsing failed while converting into model object: ' + e);
                            }
                        }
                        return [...yield obj, params];
                    }), Promise.resolve([]));
                }
                try {
                    const response = yield originalFunc.call(this, ...args);
                    return typeof response === 'object' ? JSON.parse(JSON.stringify(response)) : response;
                }
                catch (e) {
                    const error = new Error(e.message);
                    error.stack = e.stack;
                    throw error;
                }
            });
        };
    };
}
exports.Validator = Validator;
//# sourceMappingURL=decorators.js.map