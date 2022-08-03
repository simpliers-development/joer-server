import { sequelize } from '../../db';
import { User } from '../../models';
import { throwError } from '../../types/error';
import { IUserCreate } from '../../types/models/user';
import { dumpUser } from '../../utils/dumpUtils';
import BaseAuthService from '../session/Base';
import Base from './Base';

export default class CreateService extends Base {
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

            if (data.password !== data.confirmPassword) throwError('NOT_MATCH', 'password');

            const hashPassword = await BaseAuthService.helper.hashPassword(data.password);

            const newUser = await User.create(
                {
                    ...data,
                    password : hashPassword
                },
                { transaction }
            );

            const tokens = await BaseAuthService.helper.generateTokens({
                email    : newUser.email,
                username : newUser.userName
            });

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
