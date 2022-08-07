import { sequelize } from '../../db';
import Base from './Base';


export default class UserListService extends Base {
    static async execute() {
        const transaction = await sequelize.transaction();

        try {
            console.log(this.context.user);

            await transaction.commit();

            return {
            };
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}
