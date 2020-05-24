const entityRouter = require('express').Router();
const controller = require('../controllers/entity.js');
const authMiddleware = require('../middlewares/auth.js');
const roleMiddleware = require('../middlewares/checkRole.js');

entityRouter.use('/', authMiddleware);
entityRouter.use('/', roleMiddleware);

entityRouter.post('/', controller.createEntity);
entityRouter.put('/:entityId', controller.updateEntity);
entityRouter.get('/:entityId', controller.getEntityById);
entityRouter.get('/', controller.getAllEntity);

module.exports = entityRouter;
