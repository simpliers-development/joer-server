import { sequelize } from '../../db';
import { User } from '../../models';
import X from '../../types/global/X';
import Base from './Base';

interface UserDeleteServiceInput {
    id: string
}

export default class UserDeleteService extends Base {
    static get validationRules() {
        return {
            id : [ 'required', 'uuid' ]
        };
    }

    static async execute({ id }: UserDeleteServiceInput) {
        const transaction = await sequelize.transaction();

        try {
            const user = await User.findById(id, { transaction });

            if (!user) {
                throw new X({
                    code   : 'NOT_FOUND',
                    fields : {
                        user : 'NOT_FOUND'
                    }
                });
            }

            await user.destroy({ transaction });

            await transaction.commit();

            return {};
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}
