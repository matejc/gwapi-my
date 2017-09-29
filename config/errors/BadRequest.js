module.exports = {
    exec: async function(error) {
        if (error instanceof Error && error.statusCode && `${error.statusCode}`[0] === '4') {
            return true;
        }
        return false;
    },
    error: {
        httpCode: 400,
        message: 'Bad Request',
        code: 'bad_request'
    }
};
