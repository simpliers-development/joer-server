import pointer from 'json-pointer';
import { toArray } from '@joer/utils';
import { AuthHelper } from '@joer/auth-helper';
import config from '../config';

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static cookies = (_data: any): ICookie[] => {
        return [];
    };

    public static validationRules: any = [];

    public static errors: Record<string, (data: { type: string; data: any }) => void> = {};

    public static authHelper = new AuthHelper(config.jwt);

    public static context: any;
}

interface ICookie {
    name: string;
    value : string;
}
