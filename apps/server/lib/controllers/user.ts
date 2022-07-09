import { Request } from 'express';
import UserCreateService from '../services/user/Create';
import UserDeleteService from '../services/user/Delete';
import UserListService from '../services/user/List';
import UserShowService from '../services/user/Show';
import UserTestService from '../services/user/Test';
import UserUpdateService from '../services/user/Update';
import { ServiceRunner } from '../utils/ServiceRunner';


export default {
    list   : ServiceRunner.runService(UserListService, () => ({})),
    show   : ServiceRunner.runService(UserShowService, (req: Request) => ({ id: req.params.id })),
    delete : ServiceRunner.runService(UserDeleteService, (req: Request) => ({ id: req.params.id })),
    create : ServiceRunner.runService(UserCreateService, (req: Request) => ({ ...req.body })),
    update : ServiceRunner.runService(UserUpdateService, (req: Request) => ({ ...req.body, id: req.params.id })),
    test   : ServiceRunner.runService(UserTestService, (req: Request) => ({ users: req.body.data || [] }))
};
