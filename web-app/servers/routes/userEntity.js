const entityRouter = require('express').Router();
const controller = require('../controllers/entity.js');
const authMiddleware = require('../middlewares/auth.js');

entityRouter.use('/:role/entities', authMiddleware);

entityRouter.get('/:role/entities/:entityId', controller.getEntityByIdForUser);
entityRouter.get('/:role/entities', controller.getAllEntityForUser);

module.exports = entityRouter;
