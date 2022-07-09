import _jsonPointer from 'json-pointer';

import _renameKeys from 'rename-keys';

const _jsonPointer2 = _interopRequireDefault(_jsonPointer);

const _renameKeys2 = _interopRequireDefault(_renameKeys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

export default class X extends Error {
    constructor(data) {
        super();
        if (!data.fields) throw new Error('FIELDS_REQUIRED');
        if (!data.code) throw new Error('MESSAGE_REQUIRED');

        const fields = _jsonPointer2.default.dict(data.fields);

        this.fields = (0, _renameKeys2.default)(fields, str => {
            return str.substr(1);
        });

        this.code = data.code;
        this.message = data.message;
    }

    toHash() {
        return {
            fields : this.fields,
            code   : this.code
        };
    }
}
