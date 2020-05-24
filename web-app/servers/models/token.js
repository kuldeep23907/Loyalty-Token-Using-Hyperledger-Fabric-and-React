const network = require('../fabric/network.js');
const authenticateUtil = require('../utils/authenticate.js');
const apiResponse = require('../utils/apiResponse.js');

exports.grantTokensToEntity = async (isManufacturer,isMiddlemen, isConsumer, information) => {
    const { id, paymentId, amount, tokenGrantEntityId, tokenTakeEntityId} = information;

    const networkObj = await network.connect(isManufacturer,isMiddlemen,isConsumer, id);
    let contractRes;

    contractRes = await network.invoke(networkObj, 'grantTokensToEntityTransaction', paymentId, amount, "grant",  tokenGrantEntityId, tokenTakeEntityId);
  
    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = walletRes.status || networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.grantTokensToConsumer = async (isManufacturer,isMiddlemen, isConsumer, information) => {
    const { id, paymentId, amount, tokenGrantEntityId, consumerId} = information;

    const networkObj = await network.connect(isManufacturer,isMiddlemen,isConsumer, id);
    let contractRes;

    contractRes = await network.invoke(networkObj, 'grantTokensToConsumerTransaction', paymentId, amount, "grant",  tokenGrantEntityId, consumerId);
  
    const error =  networkObj.error || contractRes.error;
    if (error) {
        const status =  networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.reedemTokensTransaction = async (isManufacturer,isMiddlemen, isConsumer, information) => {
    const { id, paymentId, amount, consumerId, retailerId} = information;

    const networkObj = await network.connect(isManufacturer,isMiddlemen,isConsumer, id);
    let contractRes;

    contractRes = await network.invoke(networkObj, 'reedemTokensTransaction', paymentId, amount, "reedem", consumerId, retailerId);
  
    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

