import { sequelize } from '../../db';
import { User } from '../../models';
import { uuid } from '../../types/common';
import { throwError } from '../../types/error';
import { dumpUser, dumpTokenData } from '../../utils/dumpUtils';
import Base from './Base';

interface IUserCreate {
    id: uuid;
    email: string;
    userName: string;
    password: string;
    passwordConfirmation: string;
    firstName: string;
    lastName: string;
}
export default class UserCreateService extends Base {
    static get validationRules() {
        return {
            email                : [ 'required', 'email' ],
            userName             : [ 'required', 'string' ],
            password             : [ 'required', 'string', { 'min_length': 4 } ],
            passwordConfirmation : [ 'required', { equal_to_field: 'password' } ],
            firstName            : [ 'required', 'string' ],
            lastName             : [ 'required', 'string' ]
        };
    }

    static async execute(data: IUserCreate) {
        const transaction = await sequelize.transaction();

        try {
            if (await User.findOne({ where: { email: data.email } })) throwError('NOT_UNIQUE', 'email');

            if (await User.findOne({ where: { userName: data.userName } })) throwError('NOT_UNIQUE', 'userName');

            const hashPassword = await this.authHelper.hashPassword(data.password);

            const newUser = await User.create(
                {
                    ...data,
                    password : hashPassword
                },
                { transaction }
            );

            const tokens = this.authHelper.generateTokens(dumpTokenData(newUser));

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

    static cookies = (_data: any) => {
        return [
            {
                name  : 'accessToken',
                value : _data.accessToken
            },
            {
                name  : 'refreshToken',
                value : _data.refreshToken
            }
        ];
    };
}
