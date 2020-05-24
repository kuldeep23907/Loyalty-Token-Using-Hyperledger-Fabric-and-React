const network = require('../fabric/network.js');
const apiResponse = require('../utils/apiResponse.js');

exports.createEntity = async information => {
    const { id, externalId, type, earnRate} = information;

    const networkObj = await network.connect(true, false, false, id);
    const contractRes = await network.invoke(networkObj, 'createEntity', externalId, type, earnRate);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.updateEntity = async information => {
    const { id, entityId, earnRate} = information;

    const networkObj = await network.connect(true, false, false, id);
    const contractRes = await network.invoke(networkObj, 'updateEntity', entityId, earnRate);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getEntityById = async information => {
    const { id, entityId} = information;

    const networkObj = await network.connect(true, false, false, id);
    const contractRes = await network.invoke(networkObj, 'queryAsset', entityId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getEntityByIdForUser = async ( isManufacturer, isMiddlemen, isConsumer, information) => {
    const { id, entityId} = information;

    const networkObj = await network.connect(isManufacturer, isMiddlemen, false, id);
    const contractRes = await network.invoke(networkObj, 'queryAsset', entityId);

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getAllEntity = async information => {
    const { id } = information;

    const networkObj = await network.connect(true, false, false, id);
    const contractRes = await network.invoke(networkObj, 'queryAll', "Entity");

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getAllEntityForUser = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { id } = information;

    const networkObj = await network.connect(isManufacturer, isMiddlemen, false, id);
    const contractRes = await network.invoke(networkObj, 'queryAll', "Entity");

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};