import 'livr';
import moment from 'moment';
import Validator from 'livr/lib/Validator';
import rules from 'livr-extra-rules';
import X from '../types/global/X';

function isUnset(value: any) {
    return (value === undefined || value === null || value === '');
}

const defaultRules = {
    ...rules,
    'date'() {
        return (value: any, _: any, outputArr: any) => {
            if (isUnset(value)) return;
            if (!moment(value).isValid()) return 'WRONG_DATE';
            if (moment.utc(value).year() < 1) return 'WRONG_DATE';
            outputArr.push(moment.utc(value));
        };
    }
};

Validator.registerDefaultRules({
    ...defaultRules,
    ...Validator.getDefaultRules()
});

export default function validate(data: any, validationRules: any) {
    const tempValidator = new Validator(validationRules);
    const validData = tempValidator.validate(data);

    if (validData) {
        return validData;
    }

    throw new X({
        code   : 'FORMAT_ERROR',
        fields : {
            ...tempValidator.getErrors()
        }
    });
}
