const authRouter = require('express').Router();
const controller = require('../controllers/auth.js');
const authMiddleware = require('../middlewares/auth.js');
const roleMiddleware = require('../middlewares/checkRole.js');

authRouter.use('/users/:role/:uid', authMiddleware);
authRouter.use('/users/:role', authMiddleware);
authRouter.use('/users/:role/:uid', roleMiddleware);
authRouter.use('/users/:role', roleMiddleware);


authRouter.use('/consumers/:role', authMiddleware);
authRouter.use('/consumers/:role/:uid', authMiddleware);

authRouter.post('/users/:role', controller.signup);
authRouter.get('/users/:role/:uid', controller.checkExistence);
authRouter.get('/users/:role', controller.getAllUser);
authRouter.put('/users/:role/:uid', controller.changeInfo);
authRouter.delete('/users/:role/:uid', controller.signout);

authRouter.post('/consumers/:role', controller.signup);
authRouter.get('/consumers/:role/:uid', controller.checkExistence);
authRouter.get('/consumers/:role', controller.getAllConsumer);
authRouter.put('/consumers/:role/:uid', controller.changeInfo);
authRouter.delete('/consumers/:role/:uid', controller.signout);
authRouter.get('/consumer/:role/:uid', controller.getConsumerByConsumerId);

authRouter.post('/tokens/:role', controller.signin);
authRouter.get('/tokens/:role', controller.certifyUser);
authRouter.put('/tokens/:role', controller.reissueAccessToken);

module.exports = authRouter;
