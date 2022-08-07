
declare module 'livr/lib/Validator' {
    export default class Validator {
        constructor(some: any)

        static registerDefaultRules(p1: any) : null;

        static getDefaultRules() : any[]

        getErrors(): any;

        validate(p1: any) : any;
    }
}

declare module 'livr-extra-rules' {
    const rules: [];

    export default rules;
}
