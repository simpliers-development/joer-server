import 'livr';
import Validator from 'livr/lib/Validator';
import rules from 'livr-extra-rules';
import X from '../types/global/X';

Validator.registerDefaultRules({
    ...rules,
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
