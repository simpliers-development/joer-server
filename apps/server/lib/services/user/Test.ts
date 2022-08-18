import { sequelize } from '../../db';
import Base from './Base';


export default class UserListService extends Base {
    static async execute() {
        const transaction = await sequelize.transaction();

        try {
            await transaction.commit();

            return {
                ...this.context.user
            };
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}
