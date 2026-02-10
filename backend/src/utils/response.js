const sendResponse = (res, statusCode, data, message) => {
    res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

module.exports = sendResponse;
