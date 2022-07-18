import Sequelize, { CreationOptional, ModelAttributes, ModelStatic, Transaction, WhereOptions } from 'sequelize';
import { uuid, TransactionOptions } from '../types/common';
import { throwError } from '../types/error';

export default class Base<T, K> extends Sequelize.Model<T, K> {
    declare createdAt: CreationOptional<Date>;

    declare updatedAt: CreationOptional<Date>;

    static sequelizeTimeStampFields = {
        createdAt : { type: Sequelize.DATE, allowNull: false },
        updatedAt : { type: Sequelize.DATE, allowNull: false },
        deletedAt : { type: Sequelize.DATE, allowNull: true }
    };

    static async findById<N extends Sequelize.Model>(this: ModelStatic<N>, id: uuid, opts?: { transaction: Transaction})
        : Promise<N | null> {
        return this.findByPk(id, opts);
    }

    async validateFieldUnique<N extends Sequelize.Model>(
        this: N, model: ModelStatic<N>, field: keyof ModelAttributes<N>, value: any,
        { transaction }: TransactionOptions
    ) {
        if (!field) return;

        if (this.getDataValue(field) === value) return;

        const existingEmail = await model.findOne({
            where : {
                [field] : value
            } as WhereOptions,
            transaction
        });

        if (existingEmail) throwError('NOT_UNIQUE', 'email');

        return;
    }
}
