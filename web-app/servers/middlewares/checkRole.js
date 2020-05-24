const apiResponse = require('../utils/apiResponse.js');

module.exports = async (req, res, next) => {
    const {Role} = req.body;
    console.log(req.body);

    if (!Role) {
        return apiResponse.unauthorized(res, 'Unauthorised user');
    }

    try {
        if( Role === 'admin') {
            return next();
        }
        return apiResponse.unauthorized(res, "User role admin required");
    } catch (err) {
        return apiResponse.unauthorized(res, err.toString());
    }
};
