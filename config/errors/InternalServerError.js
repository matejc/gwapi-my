module.exports = {
    exec: async function(error, data) {
        return error instanceof Error;
    },
    error: {
        httpCode: 500,
        message: 'Internal Server Error',
        code: 'internal_error'
    }
};
