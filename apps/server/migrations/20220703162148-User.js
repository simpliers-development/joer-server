

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable('Users', {
                id        : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
                email     : { type: Sequelize.STRING, unique: true, allowNull: false },
                userName  : { type: Sequelize.STRING, unique: true, allowNull: false },
                password  : { type: Sequelize.STRING, allowNull: false },
                firstName : { type: Sequelize.STRING, allowNull: true },
                lastName  : { type: Sequelize.STRING, allowNull: true },
                createdAt : { type: Sequelize.DATE, allowNull: false },
                updatedAt : { type: Sequelize.DATE, allowNull: false },
                deletedAt : { type: Sequelize.DATE, allowNull: true }
            }, { transaction });

            await transaction.commit();
        } catch (e) {
            console.error(e);
            await transaction.rollback();
            throw e;
        }
    },

    async down(queryInterface) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.dropTable('Users');

            await transaction.commit();
        } catch (e) {
            console.error(e);
            await transaction.rollback();
            throw e;
        }
    }
};
