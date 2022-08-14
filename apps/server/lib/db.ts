import { Sequelize } from 'sequelize';
import config from './config';

const { dev, test } = config.db;

let POSTGRES_USER;

let POSTGRES_PASSWORD;

let POSTGRES_HOST;

let POSTGRES_PORT;

let POSTGRES_NAME;

if (!config.isTest) {
    POSTGRES_USER = dev.user;
    POSTGRES_PASSWORD = dev.password;
    POSTGRES_HOST = dev.host;
    POSTGRES_PORT = dev.port;
    POSTGRES_NAME = dev.name;
} else {
    POSTGRES_USER = test.user;
    POSTGRES_PASSWORD = test.password;
    POSTGRES_HOST = test.host;
    POSTGRES_PORT = test.port;
    POSTGRES_NAME = test.name;
}

const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_NAME}`;
const herokuString = process.env.DATABASE_URL || '';


const connect = process.env.NODE_ENV === 'production' ? herokuString : connectionString;

export const sequelize = (() => {
    if (process.env.NODE_ENV === 'production') {
        return new Sequelize(connect, {
            logging        : config.isTest ? false : console.log,
            dialectOptions : {
                ssl : {
                    require            : true,
                    rejectUnauthorized : false
                }
            }
        });
    }

    return new Sequelize(connect, {
        logging : config.isTest ? false : console.log,
        ssl     : false
    });
})();

const db = {
    Sequelize,
    sequelize
};


export default db;
