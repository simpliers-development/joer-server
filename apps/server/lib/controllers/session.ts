import { Request } from 'express';
import CheckService from '../services/session/Check';
import { ServiceRunner } from '../utils/ServiceRunner';


export default {
    check : ServiceRunner.runService(CheckService, (req: Request) => ({ tocken: req.cookies.token }))
};
