const router = require('express').Router();

const authRouter = require('./auth.js');
const entityRouter = require('./entity.js');
const userEntityRouter = require('./userEntity.js');
const tokenRouter = require('./token.js');

router.use('/auth', authRouter);
router.use('/entities', entityRouter);
router.use('/token', tokenRouter);
router.use('/user', userEntityRouter);

module.exports = router;
