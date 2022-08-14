import { Router } from 'express';
import controllers from './controllers';

const { check: checkSession } = controllers.session;

const router = Router();

// Users
router.get('/users', controllers.user.list);
router.get('/users/:id', controllers.user.show);
router.post('/users', controllers.user.create);
router.patch('/users/:id', controllers.user.update);
router.delete('/users/:id', controllers.user.delete);


// Events
router.get('/events', controllers.event.list);


router.get('/test', checkSession, controllers.user.test);

export default router;

