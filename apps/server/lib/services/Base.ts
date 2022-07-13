import pointer from 'json-pointer';
import { toArray } from '@joer/utils';


export default class BaseService {
    public static _rawParams: any;

    public static getMatchedParams(values: string[], scope?: string) {
        const root = scope
            ? pointer.get(this._rawParams, scope)
            : this._rawParams;

        const fields = Object.entries(pointer.dict(root))
            .map(([ key, value ]) => ({
                key : key.substr(1),
                value
            }));

        const matched = fields.filter(({ value }) => toArray(values).some((v) => v === value));

        return matched.map(m => m.key);
    }

    public static validation(data: any): any {
        return data;
    }

    public static execute(data: any): any {
        return data;
    }

    public static validationRules: any = [];

    public static errors: Record<string, (data: { type: string; data: any }) => void> = {};
}

