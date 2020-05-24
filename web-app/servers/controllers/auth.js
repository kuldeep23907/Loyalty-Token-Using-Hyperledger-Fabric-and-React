const authModel = require('../models/auth.js');
const apiResponse = require('../utils/apiResponse.js');

exports.signup = async (req, res) => {
    const { id, entityId, entityUserId, name, email, phone, address, password } = req.body;
    const { role } = req.params;

    console.log(req.body);
    console.log(role);

    if (
        (role === 'manufacturer' || role === 'middlemen') &&
        (!id || !password || !name || !entityId || !email || !phone)
    ) {
        console.log('1');
        return apiResponse.badRequest(res);
    }

    if (
        role === 'consumer' &&
        (!id || !entityUserId || !password || !name || !entityId || !email || !phone || !address)
    ) {
        console.log('2');
        return apiResponse.badRequest(res);
    }

    let modelRes;

    if (role === 'manufacturer') {
        modelRes = await authModel.signup(true, false, false, { id, entityId, name, email, phone, password });
    } else if (role === 'middlemen') {
        modelRes = await authModel.signup(false, true, false, { id, entityId, name, email, phone, password });
    } else if (role === 'consumer') {
        console.log('3');
        modelRes = await authModel.signup(false, false, true, {
            id,
            entityId,
            entityUserId,
            name,
            email,
            phone,
            address,
            password,
        });
    } else {
        return apiResponse.badRequest(res);
    }

    return apiResponse.send(res, modelRes);
};

exports.checkExistence = async (req, res) => {
    const { role, uid } = req.params;

    if (!uid) {
        return apiResponse.badRequest(res);
    }

    let modelRes;
    if (role === 'manufacturer') {
        modelRes = await authModel.checkExistence(true, false, false, { uid });
    } else if (role === 'middlemen') {
        modelRes = await authModel.checkExistence(false, true, false, { uid });
    } else if (role === 'consumer') {
        console.log('3');
        modelRes = await authModel.checkExistence(false, false, true, { uid });
    } else {
        return apiResponse.badRequest(res);
    }

    return apiResponse.send(res, modelRes);
};

exports.signin = async (req, res) => {
    const { id, password } = req.body;
    const { role } = req.params;
    if (!id || !password) {
        return apiResponse.badRequest(res);
    }

    let modelRes;
    if (role === 'manufacturer') {
        modelRes = await authModel.signin(true, false, false, { id, password });
    } else if (role === 'middlemen') {
        modelRes = await authModel.signin(false, true, false, { id, password });
    } else if (role === 'consumer') {
        modelRes = await authModel.signin(false, false, true, { id, password });
    } else {
        return apiResponse.badRequest(res);
    }

    return apiResponse.send(res, modelRes);
};

exports.changeInfo = async (req, res) => {
    const { id, newPassword, newName, newEmail, newPhone, newAddress } = req.body;
    const { role, uid } = req.params;

    if (!role) {
        return apiResponse.badRequest(res);
    }

    if (role === 'manufacturer' || role === 'middlemen') {
        if (!uid || !newPassword || !newName || !newEmail || !newPhone) {
            return apiResponse.badRequest(res);
        }
    }

    if (role === 'consumer') {
        if (!id || !uid || !newPassword || !newName || !newEmail || !newPhone || !newAddress || id !== uid) {
            return apiResponse.badRequest(res);
        }
    }

    let modelRes;
    if (role === 'manufacturer') {
        modelRes = await authModel.changeInfo(true, false, false, {
            uid,
            newPassword,
            newName,
            newEmail,
            newPhone,
            newAddress,
        });
    } else if (role === 'middlemen') {
        modelRes = await authModel.changeInfo(false, true, false, {
            uid,
            newPassword,
            newName,
            newEmail,
            newPhone,
            newAddress,
        });
    } else if (role === 'consumer') {
        modelRes = await authModel.changeInfo(false, false, true, {
            id,
            newPassword,
            newName,
            newEmail,
            newPhone,
            newAddress,
        });
    } else {
        return apiResponse.badRequest(res);
    }

    return apiResponse.send(res, modelRes);
};

exports.signout = async (req, res) => {
    const { id, password } = req.body;
    const { role, uid } = req.params;

    if (!password || id !== uid) {
        return apiResponse.badRequest(res);
    }

    let modelRes;
    if (role === 'manager') {
        modelRes = await authModel.signout(true, { id, password });
    } else if (role === 'student') {
        modelRes = await authModel.signout(false, { id, password });
    } else {
        return apiResponse.badRequest(res);
    }

    return apiResponse.send(res, modelRes);
};

exports.certifyUser = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { role } = req.params;

    if (!token || !(role === 'manufacturer' || role === 'middlemen' || role === 'consumer')) {
        return apiResponse.badRequest(res);
    }

    const modelRes = await authModel.certifyUser(token);
    return apiResponse.send(res, modelRes);
};

exports.reissueAccessToken = async (req, res) => {
    const refreshToken = req.headers['x-refresh-token'];
    const { role } = req.params;

    if (!refreshToken) {
        return apiResponse.badRequest(res);
    }

    let modelRes;
    if (role === 'manager') {
        modelRes = await authModel.reissueAccessToken(true, refreshToken);
    } else if (role === 'student') {
        modelRes = await authModel.reissueAccessToken(false, refreshToken);
    } else {
        return apiResponse.badRequest(res);
    }

    return apiResponse.send(res, modelRes);
};

exports.getAllUser = async (req, res) => {
    const { id } = req.body;
    const { role } = req.params;

    let modelRes;
    if (role === 'manufacturer') {
        modelRes = await authModel.getAllUser(true, false, false, {id});
    } else if (role === 'middlemen') {
        modelRes = await authModel.getAllUser(false, true, false, {id});
    } else {
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};

exports.getAllConsumer = async (req, res) => {
    const { id } = req.body;
    const { role } = req.params;

    let modelRes;
    if (role === 'manufacturer') {
        modelRes = await authModel.getAllConsumer(true, false, false, {id});
    } else if (role === 'middlemen') {
        modelRes = await authModel.getAllConsumer(false, true, false, {id});
    } else {
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};

exports.getConsumerByConsumerId = async (req, res) => {
    const { id } = req.body;
    const { role, uid } = req.params;
    console.log(req.body);
    let modelRes;
    if (role === 'consumer') {
        modelRes = await authModel.getConsumerByConsumerId(false, false, true, {uid});
    } else {
        return apiResponse.badRequest(res);
    }
    return apiResponse.send(res, modelRes);
};
