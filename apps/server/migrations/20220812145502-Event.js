module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await queryInterface.createTable('Events', {
                id               : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
                name             : { type: Sequelize.STRING, allowNull: false },
                description      : { type: Sequelize.TEXT, allowNull: true },
                topic            : { type: Sequelize.STRING, allowNull: false },
                isOffline        : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
                isPublic         : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
                beginDate        : { type: Sequelize.DATE, allowNull: false },
                finishDate       : { type: Sequelize.DATE, allowNull: false },
                participantLimit : { type: Sequelize.INTEGER, allowNull: true },
                isQRNeeded       : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
                location         : { type: Sequelize.STRING, allowNull: false },
                organizatorId    : {
                    type       : Sequelize.UUID,
                    onDelete   : 'CASCADE',
                    references : {
                        model : 'Users',
                        key   : 'id'
                    },
                    allowNull : false
                },


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
            await queryInterface.dropTable('Events');

            await transaction.commit();
        } catch (e) {
            console.error(e);
            await transaction.rollback();
            throw e;
        }
    }
};
