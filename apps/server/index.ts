import bodyParser from 'body-parser';
import express from 'express';
import config from './lib/config';
import db from './lib/db';
import router from './lib/router';

const app = express();
const PORT = config.app.port;

process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
});

app.use(bodyParser.json());
app.use('/api/v1', router);

app.listen(PORT, async () => {
    console.log(`Listen porn ${PORT}`);
    try {
        await db.sequelize.authenticate();

        console.log('Connection has been established successfully.');
    } catch (e) {
        console.error('Connection to database failed');
    }
});
