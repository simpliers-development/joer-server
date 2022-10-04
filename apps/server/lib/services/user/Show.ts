import { sequelize } from '../../db';
import { User } from '../../models';
import X from '../../types/global/X';
import { dumpUser } from '../../utils/dumpUtils';
import Base from './Base';

interface UserShowServiceInput {
    id: string
}

export default class UserShowService extends Base {
    static get validationRules() {
        return {
            id : [ 'required', 'uuid' ]
        };
    }

    static async execute({ id }: UserShowServiceInput) {
        const transaction = await sequelize.transaction();

        try {
            const user = await User.findById(id, {
                transaction,
                include : [
                    User.associations.OrganizedEvents
                ]
            });


            if (!user) {
                throw new X({
                    code   : 'NOT_FOUND',
                    fields : {
                        user : 'NOT_FOUND'
                    }
                });
            }

            await transaction.commit();

            return {
                data : dumpUser(user)
            };
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}
