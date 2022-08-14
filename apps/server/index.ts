import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import config from './lib/config';
import db, { sequelize } from './lib/db';
import * as models from './lib/models';
import router from './lib/router';

for (const modelName in models) { // eslint-disable-line
    const model: Record<any, any> = sequelize.model(modelName);

    if (model.initRelation) {
        model.initRelation();
    }
}

const app = express();
const PORT = process.env.PORT || config.app.port;

process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/v1', router);

if (!config.isTest) {
    app.listen(PORT, async () => {
        console.log(`Listen porn ${PORT}`);
        try {
            await db.sequelize.authenticate();

            console.log('Connection has been established successfully.');
        } catch (e: any) {
            console.log(e);
            console.error('Connection to database failed');
        }
    });
}

export default app; // for tests
