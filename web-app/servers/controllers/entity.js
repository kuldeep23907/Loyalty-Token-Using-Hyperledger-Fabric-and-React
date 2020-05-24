const entityModel = require('../models/entity.js');
const apiResponse = require('../utils/apiResponse.js');

exports.createEntity = async (req, res) => {
    const { id, externalId, type, earnRate } = req.body;
    console.log('1');

    if (!externalId || !type || !earnRate) {
        return apiResponse.badRequest(res);
    }
    console.log('2');

    const allowedEntityTypes = ['wholesaler', 'distributor', 'retailer'];
    if (!allowedEntityTypes.includes(type) || earnRate < 0.05 || earnRate > 0.15) {
        return apiResponse.badRequest(res);
    }
    console.log('3');

    const modelRes = await entityModel.createEntity({ id, externalId, type, earnRate });
    return apiResponse.send(res, modelRes);
};

exports.updateEntity = async (req, res) => {
    const { id, earnRate } = req.body;
    const { entityId } = req.params;

    if (!entityId) {
        return apiResponse.badRequest(res);
    }

    if (earnRate < 0.05 || earnRate > 0.15) {
        return apiResponse.badRequest(res);
    }

    const modelRes = await entityModel.updateEntity({ id, entityId, earnRate });
    return apiResponse.send(res, modelRes);
};

exports.getEntityById = async (req, res) => {
    const { id } = req.body;
    const { entityId } = req.params;

    if (!entityId) {
        return apiResponse.badRequest(res);
    }

    const modelRes = await entityModel.getEntityById({ id, entityId });
    return apiResponse.send(res, modelRes);
};

exports.getEntityByIdForUser = async (req, res) => {
    const { id, entity_id } = req.body;
    const { role, entityId } = req.params;

    console.log('sdcsd',entity_id);

    if (!entityId || !entity_id || entityId !== entity_id) {
        return apiResponse.badRequest(res);
    }

    let modelRes;
    if (role === 'manufacturer') {
        modelRes = await entityModel.getEntityByIdForUser(true, false, false, { id, entityId});
    } else if (role === 'middlemen') {
        modelRes = await entityModel.getEntityByIdForUser(false, true, false, { id, entityId });
    } else {
        return apiResponse.badRequest(res);
    }

    return apiResponse.send(res, modelRes);
};

exports.getAllEntity = async (req, res) => {
    const { id } = req.body;

    const modelRes = await entityModel.getAllEntity({ id });
    return apiResponse.send(res, modelRes);
};

exports.getAllEntityForUser = async (req, res) => {
    const { id } = req.body;
    const { role } = req.params;

    let modelRes;
    if (role === 'manufacturer') {
        modelRes = await entityModel.getAllEntityForUser(true, false, false, { id });
    } else if (role === 'middlemen') {
        modelRes = await entityModel.getAllEntityForUser(false, true, false, { id });
    } else {
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};
