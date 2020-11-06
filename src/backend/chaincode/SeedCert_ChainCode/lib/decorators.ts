/**
 *
 * Copyright (c) 2020, Oracle and/or its affiliates. All rights reserved.
 *
 */
import 'reflect-metadata';
import { Schema, object } from 'yup';

export const mandatoryMetadataKey = Symbol('mandatory');
export const allowMetadataKey = Symbol('default');

export const isSchema = (schema: any): schema is Schema<any> => 'validate' in schema;

export function Mandatory() {
    return (target: any, key: string) => {
        const required = Reflect.getMetadata(mandatoryMetadataKey, target);
        Reflect.defineMetadata(mandatoryMetadataKey, {
            ...required,
            [key]: true,
        }, target);
    };
}

export function checkMandatory(obj: any) {
    let mandatory = {};

    try {
        mandatory = Reflect.getMetadata(mandatoryMetadataKey, obj) || {};
    } catch (e) {
        // empty
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

export function Default(defaultValue: any) {
    return (target: any, key: string) => {
      const defaults = Reflect.getMetadata(allowMetadataKey, target) || {};

      Reflect.defineMetadata(allowMetadataKey, {
        ...defaults,
        [key]: defaultValue,
      }, target);
    };
  }

export function getDefaults(obj: any) {
    const defaults = Reflect.getMetadata(allowMetadataKey, obj);

    return !defaults ? {} : Object.keys(defaults)
        .reduce((result, k) => ({
          ...result,
          [k]: typeof defaults[k] === 'function' ? defaults[k]() : defaults[k],
    }), {});
}

export function Id(name: string) {
    return (constructor: Function) => {
        constructor.prototype._pk = name;
    };
}

export function Validate(input: any) {
    const schema = input as Schema<any>;

    return (target: any, key: string) => {
        const getterSetter = {
            get() {
                return this[`_${key}`];
            },
            set(value) {
                let setMethod = target.__lookupSetter__(key);
                setMethod = !setMethod || setMethod === getterSetter.set ? (val => val) : setMethod;

                try {
                    this[`_${key}`] = schema.validateSync(setMethod.call(this, value));
                } catch (ex) {
                    throw new Error(`Error in field '${key}' with value '${JSON.stringify(value)}': ${ex.message}`);
                }
            },
            enumerable: true,
            configurable: true,
        };

        Object.defineProperty(target, key, getterSetter);
    };
}

export function Validator(...models: any) {
    return (
        target: any,
        key: string,
        descriptor: PropertyDescriptor,
    ) => {
        const originalFunc = descriptor.value;

        if (typeof originalFunc !== 'function') {
            throw new Error('Validator controller function is invalid');
        }

        const schemas = models.map(model => [isSchema(model) ? model : object()
            .transform(val => val instanceof model ? val : new model(val)), !isSchema(model) && model]);

        descriptor.value = async function newFunc(
            this: any,
            args: string[],
        ) {
            if (schemas) {
                args = await schemas.reduce(async (obj, [schema, model], i) => {
                    let params;

                    try {
                        params = await schema.validate(args[i]);
                    } catch (e) {
                        throw new Error('Validation of arguments failed: ' + e);
                    }

                    if (model) {
                        try {
                            params = new model(JSON.parse(args[i]));
                        } catch (e) {
                            throw new Error('JSON parsing failed while converting into model object: ' + e);
                        }
                    }

                    return [...await obj, params];
                }, Promise.resolve([]));
            }

            try {
                const response = await originalFunc.call(this, ...args);
                return typeof response === 'object' ? JSON.parse(JSON.stringify(response)) : response;
            } catch (e) {
                const error = new Error(e.message);
                error.stack = e.stack;
                throw error;
            }
        };
    };
}
