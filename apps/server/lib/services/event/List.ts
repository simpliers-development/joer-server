import { sequelize } from '../../db';
import Event from '../../models/Event';
import { dumpEvent } from '../../utils/dumpUtils';
import Base from './Base';


export default class UserListService extends Base {
    static async execute() {
        const transaction = await sequelize.transaction();

        try {
            const events = await Event.findAll({ transaction });

            await transaction.commit();

            return {
                data : events.map(dumpEvent)
            };
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}
