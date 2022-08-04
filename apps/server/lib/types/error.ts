import pointer from 'json-pointer';
import X from './global/X.js';

export type ErrTypedField = { type: string, key: string }
export class TypedError extends Error {
    public type: string;

    public payload: any;

    constructor(type: string, payload: any) {
        super();
        this.type = type;
        this.payload = payload;
    }

    toHash() {
        return {
            type    : this.type,
            payload : this.payload
        };
    }
}


export function throwError(type: string, data?: any): never {
    if (data && typeof data === 'string') {
        checkDefaultErrors(type, data);
    }

    switch (type) {
        case 'BAD_NAMES':
            throw new X({
                code   : 'BAD_VALUE',
                fields : errTypedFields(data.map(({ type: errType, key }: ErrTypedField) => ({
                    type : errType,
                    keys : key
                })))
            });
        case 'TOKEN_EXPIRED':
            throw new X({
                code   : 'TOKEN_EXPIRED',
                fields : errTypedFields(data.map(({ type: errType, key }: ErrTypedField) => ({
                    type : errType,
                    keys : key
                })))
            });
        case 'BAD_TOKEN':
            throw new X({
                code   : 'BAD_TOKEN',
                fields : errTypedFields(data.map(({ type: errType, key }: ErrTypedField) => ({
                    type : errType,
                    keys : key
                })))
            });

        default:
            throw new X({
                code    : 'UNKNOWN_ERROR',
                fields  : {},
                message : 'Please, contact your system administrator'
            });
    }
}

export function checkDefaultErrors(type: string, data: string): never | void {
    if (type === 'NOT_FOUND') {
        throw new X({
            code   : 'NOT_FOUND',
            fields : {
                [data] : 'NOT_FOUND'
            }
        });
    } else if (type === 'NOT_UNIQUE') {
        throw new X({
            code   : 'NOT_UNIQUE',
            fields : {
                [data] : 'NOT_UNIQUE'
            }
        });
    }
}

type Fields = { type: string; keys: any[] }[];

export const errTypedFields = (fields: Fields) => {
    const data = {};

    if (Array.isArray(fields)) {
        fields.forEach(field => {
            if (!field.keys) return;
            field.keys.forEach((key: string) => {
                return pointer.set(data, `/${key}`, field.type);
            });
        });
    }

    return data;
};

export const errFields = (key: string, fields: Fields) => {
    const data = {};

    if (Array.isArray(fields)) {
        fields.forEach(field => {
            pointer.set(data, `/${field}`, key);
        });
    }

    return data;
};
