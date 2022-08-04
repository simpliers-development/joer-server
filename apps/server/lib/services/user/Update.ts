import { sequelize } from '../../db';
import { User } from '../../models';
import { throwError } from '../../types/error';
import { IUserAttributes } from '../../types/models/user';
import { dumpUser } from '../../utils/dumpUtils';
import Base from './Base';

export default class UserUpdateService extends Base {
    static get validationRules() {
        return {
            id        : [ 'required', 'uuid' ],
            email     : [ 'required', 'email' ],
            userName  : [ 'required', 'string' ],
            firstName : [ 'required', 'string' ],
            lastName  : [ 'required', 'string' ]
        };
    }

    static async execute(data: IUserAttributes) {
        const transaction = await sequelize.transaction();

        try {
            const user = await User.findById(data.id, { transaction });

            if (!user) {
                throwError('NOT_FOUND', 'user');
            }

            await user.validateFieldUnique(User, 'email', data.email, { transaction });

            const newUser = await user.update({
                email     : data.email,
                userName  : data.userName,
                firstName : data.firstName,
                lastName  : data.lastName
            }, { transaction });

            await transaction.commit();

            return {
                data : dumpUser(newUser)
            };
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}
