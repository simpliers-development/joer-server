import { compare } from 'bcrypt';
import { sequelize } from '../../db';
import { User } from '../../models';
import { throwError } from '../../types/error';
import X from '../../types/global/X';
import { dumpUser, dumpTokenData } from '../../utils/dumpUtils';
import Base from './Base';

interface IUser {
    email: string;
    password: string;
}
export default class SessionCreateService extends Base {
    static get validationRules() {
        return {
            email    : [ 'required', 'email' ],
            password : [ 'required', 'string', { 'min_length': 4 } ]
        };
    }

    static async execute(data: IUser) {
        const transaction = await sequelize.transaction();

        try {
            const user = await User.findOne({ where: { email: data.email } });

            if (!user) throwError('NOT_FOUND', 'user');
            const matchPass = await compare(data.password, user.password);

            if (!matchPass) {
                throw new X({
                    code   : 'WRONG_PASSWORD',
                    fields : {
                        user : 'WRONG_PASSWORD'
                    }
                });
            }

            const tokens = this.authHelper.generateTokens(dumpTokenData(user));

            await transaction.commit();

            return {
                data : dumpUser(user),
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
