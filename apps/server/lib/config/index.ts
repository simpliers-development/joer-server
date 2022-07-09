import path from 'path';
import confme from 'confme';


const config = confme(
    path.resolve('./apps/server/lib/config/config-vars.json'),
    path.resolve('./apps/server/lib/config/config-schema.json'),
);

config.isTest = process.env.MODE === 'test' || process.env.NODE_ENV === 'test';

export default config;
