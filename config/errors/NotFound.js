module.exports = {
    exec: async function(error) {
        return error instanceof Error && error.statusCode === 404;
    },
    error: {
        httpCode: 404,
        message: 'Not Found',
        code: 'not_found'
    }
};
