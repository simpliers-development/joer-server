import { sequelize } from '../../db';
import { User } from '../../models';
import { throwError } from '../../types/error';
import X from '../../types/global/X';
import { IUserCreate } from '../../types/models/user';
import { dumpUser, dumpTokenData } from '../../utils/dumpUtils';
import Base from './Base';

export default class UserCreateService extends Base {
    static get validationRules() {
        return {
            email           : [ 'required', 'email' ],
            userName        : [ 'required', 'string' ],
            password        : [ 'required', 'string', { 'min_length': 4 } ],
            confirmPassword : [ 'required', 'string', { 'min_length': 4 } ],
            firstName       : [ 'required', 'string' ],
            lastName        : [ 'required', 'string' ]
        };
    }

    static async execute(data: IUserCreate) {
        const transaction = await sequelize.transaction();

        try {
            if (await User.findOne({ where: { email: data.email } })) throwError('NOT_UNIQUE', 'email');

            if (await User.findOne({ where: { userName: data.userName } })) throwError('NOT_UNIQUE', 'userName');

            if (data.password !== data.confirmPassword) {
                throw new X({
                    code   : 'AUTHENTICATION_FAILED',
                    fields : {
                        password        : 'INVALID',
                        confirmPassword : 'INVALID'
                    }
                });
            }

            const hashPassword = await this.authHelper.hashPassword(data.password);

            const newUser = await User.create(
                {
                    ...data,
                    password : hashPassword
                },
                { transaction }
            );

            const tokens = await this.authHelper.generateTokens(dumpTokenData(newUser));

            await transaction.commit();

            return {
                data : dumpUser(newUser),
                ...tokens
            };
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}
