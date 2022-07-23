const path = require('path');
const confme = require('confme');

const config = confme(
    path.resolve('./apps/server/lib/config/config-vars.json'),
    path.resolve('./apps/server/lib/config/config-schema.json'),
);

module.exports = {
    development : {
        username : config.db.dev.user,
        password : config.db.dev.password,
        database : config.db.dev.name,
        host     : config.db.dev.host,
        dialect  : config.db.dev.dialect
    },
    test : {
        username : config.db.test.user,
        password : config.db.test.password,
        database : config.db.test.name,
        host     : config.db.test.host,
        dialect  : config.db.test.dialect
    },
    production : {
        'use_env_variable' : 'DATABASE_URL',
        dialect            : 'postgres',
        protocol           : 'postgres',
        ssl                : true,
        dialectOptions     : {
            ssl : {
                require            : true,
                rejectUnauthorized : false
            }
        }
    }
};
