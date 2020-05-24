const tokenRouter = require('express').Router();
const controller = require('../controllers/token.js');
const authMiddleware = require('../middlewares/auth.js');
const roleMiddleware = require('../middlewares/checkRole.js');

tokenRouter.use('/grant-token/entity',authMiddleware);
tokenRouter.use('/grant-token/consumer',authMiddleware);
tokenRouter.use('/redeem-token',authMiddleware);

// tokenRouter.use(roleMiddleware);

tokenRouter.post('/grant-token/entity/:role', controller.grantTokensToEntity);
tokenRouter.post('/grant-token/consumer/:role', controller.grantTokensToConsumer);
tokenRouter.post('/redeem-token/:role', controller.reedemTokensTransaction);

module.exports = tokenRouter;