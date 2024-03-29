import { sequelize } from '../../db';
import { User } from '../../models';
import { dumpUser } from '../../utils/dumpUtils';
import Base from './Base';


export default class UserListService extends Base {
    static async execute() {
        const transaction = await sequelize.transaction();

        try {
            const users = await User.findAll({ transaction });

            await transaction.commit();

            return {
                data : users.map(dumpUser)
            };
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}
