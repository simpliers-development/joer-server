import { Router } from 'express';
import controllers from './controllers';

const { check: checkSession } = controllers.session;

const router = Router();

// Users
router.get('/users', controllers.user.list);
router.get('/users/:id', controllers.user.show);
router.post('/signup', controllers.user.create);
router.patch('/users/:id', controllers.user.update);
router.delete('/users/:id', controllers.user.delete);

router.post('/signin', controllers.session.create);
router.delete('/logout', controllers.session.delete);

// Events
router.get('/events', controllers.event.list);
router.post('/events', checkSession, controllers.event.create);


router.get('/test', checkSession, controllers.user.test);

router.post('/mailtest', controllers.mailTest.testMailer);
router.post('/templatertest', controllers.mailTest.testMailTemplater);
export default router;

