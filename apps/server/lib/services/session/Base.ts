import User from '../../models/User';
import { uuid } from '../../types/common';
import { throwError } from '../../types/error';
import Base from '../Base';

export default class BaseSessionService extends Base {
    public static async checkUser(id: uuid)  {
        const user = await User.findById(id);

        if (!user) {
            throwError('NOT_FOUND', 'user');
        }

        return user;
    }
}
