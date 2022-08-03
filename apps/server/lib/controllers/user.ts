import { Request } from 'express';
import CreateService from '../services/user/Create';
import DeleteService from '../services/user/Delete';
import ListService from '../services/user/List';
import ShowService from '../services/user/Show';
import TestService from '../services/user/Test';
import UpdateService from '../services/user/Update';
import { ServiceRunner } from '../utils/ServiceRunner';


export default {
    list   : ServiceRunner.runService(ListService, () => ({})),
    show   : ServiceRunner.runService(ShowService, (req: Request) => ({ id: req.params.id })),
    delete : ServiceRunner.runService(DeleteService, (req: Request) => ({ id: req.params.id })),
    create : ServiceRunner.runService(CreateService, (req: Request) => ({ ...req.body })),
    update : ServiceRunner.runService(UpdateService, (req: Request) => ({ ...req.body, id: req.params.id })),
    test   : ServiceRunner.runService(TestService, (req: Request) => ({ users: req.body.data || [] }))
};
