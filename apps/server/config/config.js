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
        username : config.db.production.user,
        password : config.db.production.password,
        database : config.db.production.name,
        host     : config.db.production.host,
        dialect  : config.db.production.dialect
    }
};
