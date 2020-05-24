const tokenModel = require('../models/token.js');
const apiResponse = require('../utils/apiResponse.js');

exports.grantTokensToEntity = async (req, res) => {
    console.log(req.body);

    const { id, paymentId, amount, tokenGrantEntityId, tokenTakeEntityId } = req.body;
    const { role } = req.params;
    console.log('1');

    if (!role || !paymentId || !amount || !tokenGrantEntityId || !tokenTakeEntityId) {
        return apiResponse.badRequest(res);
    }
    console.log('2');
    let modelRes;
    if (role === 'manufacturer') {
        modelRes = await tokenModel.grantTokensToEntity(true, false, false, {
            id,
            paymentId,
            amount,
            tokenGrantEntityId,
            tokenTakeEntityId,
        });
    } else if (role === 'middlemen') {
        modelRes = await tokenModel.grantTokensToEntity(false, true, false, {
            id,
            paymentId,
            amount,
            tokenGrantEntityId,
            tokenTakeEntityId,
        });
    } else {
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};

exports.grantTokensToConsumer = async (req, res) => {
    console.log(req.body);
    const { id, paymentId, amount, tokenGrantEntityId, consumerId } = req.body;
    console.log('1');
    const { role } = req.params;
    if (!role || !paymentId || !amount || !tokenGrantEntityId || !consumerId) {
        return apiResponse.badRequest(res);
    }
    console.log('2');

    let modelRes;
    if (role === 'middlemen') {
        modelRes = await tokenModel.grantTokensToConsumer(false, true, false, {
            id,
            paymentId,
            amount,
            tokenGrantEntityId,
            consumerId,
        });
    } else {
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};

exports.reedemTokensTransaction = async (req, res) => {
    const { id, paymentId, amount, consumerId, retailerId } = req.body;
    console.log('1');
    const { role } = req.params;

    if (!role || !paymentId || !amount || !retailerId || !consumerId) {
        return apiResponse.badRequest(res);
    }
    console.log('2');
    let modelRes;
    if (role === 'middlemen') {
        modelRes = await tokenModel.reedemTokensTransaction(false, true, false, {
            id,
            paymentId,
            amount,
            consumerId,
            retailerId,
        });
    } else {
        return apiResponse.badRequest(res);
    }

    return apiResponse.send(res, modelRes);
};
