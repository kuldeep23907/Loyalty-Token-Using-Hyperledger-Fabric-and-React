const network = require('../fabric/network.js');
const authenticateUtil = require('../utils/authenticate.js');
const apiResponse = require('../utils/apiResponse.js');

exports.signup = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { id, entityId, entityUserId, address, name, email, phone, password } = information;

    let networkObj;
    if( isMiddlemen || isManufacturer ){
        networkObj = await network.connect(true, false, false, id);
    }

    if( isConsumer ) {
        networkObj = await network.connect(false, true, false, id);
    }

    let contractRes;

    if (isManufacturer || isMiddlemen) {
        contractRes = await network.invoke(networkObj, 'createEntityUser', entityId, name, email, phone, password);
    } else {
        console.log('4');
        contractRes = await network.invoke(
            networkObj,
            'createConsumer',
            entityId,
            entityUserId,
            name,
            email,
            phone,
            address,
            password
        );
    }
    console.log('5');
    const walletRes = await network.registerUser(isManufacturer, isMiddlemen, isConsumer, contractRes.ID);

    const error = walletRes.error || networkObj.error || contractRes.error;
    if (error) {
        const status = walletRes.status || networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.checkExistence = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { uid } = information;

    const userExists = await network.checkUserExists(isManufacturer, isMiddlemen, isConsumer, uid);
    if (userExists.error) {
        return apiResponse.createModelRes(userExists.status, userExists.error);
    }

    return apiResponse.createModelRes(200, 'Success', { userExists });
};

exports.signin = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { id, password } = information;

    const networkObj = await network.connect(isManufacturer, isMiddlemen, isConsumer, id);
    let contractRes;
    contractRes = await network.query(networkObj, 'signIn', id, password);
    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }
    console.log(contractRes);
    const { EntityID, Role, Name, HashedPWD } = contractRes;
    const accessToken = authenticateUtil.generateAccessToken({ id, EntityID, Role, Name });
    const refreshToken = authenticateUtil.generateRefreshToken({ id, HashedPWD });

    return apiResponse.createModelRes(200, 'Success', { id, EntityID, Role, Name, accessToken, refreshToken });
};

exports.changeInfo = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { id, uid, newPassword, newName, newEmail, newPhone, newAddress } = information;
    const userId = isConsumer ? id : uid;
    let networkObj;
    if( isMiddlemen || isManufacturer ){
        networkObj = await network.connect(true, false, false, id);
    }

    if( isConsumer ){
        networkObj = await network.connect(false, true, false, id);
    }
    let contractRes;
    if (isManufacturer || isMiddlemen) {
        contractRes = await network.invoke(
            networkObj,
            'updateEntityUser',
            uid,
            newName,
            newEmail,
            newPhone,
            newPassword,
        );
    } else {
        console.log('4');
        contractRes = await network.invoke(
            networkObj,
            'updateConsumer',
            id,
            newName,
            newEmail,
            newPhone,
            newPassword,
            newAddress,
        );
    }
    console.log('5');
    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.signout = async (isManager, information) => {
    const { id, password } = information;

    const networkObj = await network.connect(isManager, id);
    let contractRes;
    if (isManager) {
        contractRes = await network.invoke(networkObj, 'deleteManager', id, password);
    } else {
        contractRes = await network.invoke(networkObj, 'deleteStudent', id, password);
    }

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success');
};

exports.certifyUser = async token => {
    try {
        const tokenRes = await authenticateUtil.certifyAccessToken(token);
        return apiResponse.createModelRes(200, 'Success', tokenRes);
    } catch (err) {
        return apiResponse.createModelRes(401, 'This token is invalid');
    }
};

exports.reissueAccessToken = async (isManager, refreshToken) => {
    try {
        const decodedToken = await authenticateUtil.decodedRefreshToken(refreshToken);
        const { id } = decodedToken;

        const networkObj = await network.connect(isManager, id);
        let contractRes;
        if (isManager) {
            contractRes = await network.query(networkObj, 'queryManager', id);
        } else {
            contractRes = await network.query(networkObj, 'queryStudent', id);
        }

        const error = networkObj.error || contractRes.error;
        if (error) {
            const status = networkObj.status || contractRes.status;
            return apiResponse.createModelRes(status, error);
        }

        const { hashedPw, name, departments } = contractRes;
        await authenticateUtil.certifyRefreshToken(refreshToken, hashedPw);
        const accessToken = authenticateUtil.generateAccessToken({ id, name, departments });

        return apiResponse.createModelRes(200, 'Success', { accessToken });
    } catch (err) {
        return apiResponse.createModelRes(400, 'This token is invalid');
    }
};

exports.getAllUser = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { id } = information;

    const networkObj = await network.connect(true, false, false, id);

    const contractRes = await network.invoke(networkObj, 'queryAll', 'EntityUser');

    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getAllConsumer = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { id } = information;

    const networkObj = await network.connect(isManufacturer, isMiddlemen, false, id);

    const contractRes = await network.invoke(networkObj, 'queryAll', 'Consumer');
    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};

exports.getConsumerByConsumerId = async (isManufacturer, isMiddlemen, isConsumer, information) => {
    const { uid } = information;

    const networkObj = await network.connect(false, false, true, uid);

    const contractRes = await network.invoke(networkObj, 'queryAsset', uid );
    const error = networkObj.error || contractRes.error;
    if (error) {
        const status = networkObj.status || contractRes.status;
        return apiResponse.createModelRes(status, error);
    }

    return apiResponse.createModelRes(200, 'Success', contractRes);
};
