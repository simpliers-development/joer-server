import { sequelize } from '../../db';
import { throwError, TypedError } from '../../types/error'; // move to common utils
import validate from '../../utils/livr';
import Base from './Base';


interface UserTestServiceInput {
    users: { name : string }[]
}

export default class TestService extends Base {
    static validation(data: any) {
        const validationRules = {
            users : [ 'required', { 'list_of_objects' : [ {
                name : [ 'required', 'string' ]
            } ] } ]
        };

        return validate(data, validationRules);
    }

    static async execute({ users }: UserTestServiceInput) {
        const transaction = await sequelize.transaction();

        try {
            // error handling to get all wrong items
            const errors: TypedError[] = [];

            users.forEach(u => {
                try {
                    if (u.name === 'Hello') throw new TypedError('BAD_NAME', u.name);
                } catch (e: unknown) {
                    if (e instanceof TypedError) errors.push(e);
                }
            });
            if (errors.length) throw new TypedError('BAD_NAMES', errors);

            await transaction.commit();


            return {
                data : 1
            };
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    static errors = {
        'BAD_NAMES' : ({ data }: { data: TypedError[] }) => {
            throwError('BAD_NAMES', data.map(({ type, payload }) => ({
                type,
                key : this.getMatchedParams(payload)
            })));
        }
    };
}
