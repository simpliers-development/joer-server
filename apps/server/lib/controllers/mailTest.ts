import { Request } from 'express';
import { ServiceRunner } from '../utils/ServiceRunner';
import Test from '../services/mail/TestMailer';
import TestTemplater from '../services/mail/TestMailTemplater';

export default {
    testMailer        : ServiceRunner.runService(Test, (req: Request) => ({ ...req.body })),
    testMailTemplater : ServiceRunner.runService(TestTemplater, (req: Request) => ({ ...req.body }))
};
