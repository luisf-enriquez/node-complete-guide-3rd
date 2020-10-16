const buildResponse = (res, httpCode, data, message) => {
    return res
        .status(httpCode)
        .json({
            status: httpCode,
            data,
            message,
        });
};

module.exports = {
    buildResponse
};