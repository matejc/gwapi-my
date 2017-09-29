
module.exports = {
    auth: async function(request) {
        if (request.meta.extraHeaders && request.meta.extraHeaders['x-uuid']) {
            return {error: true};
        }
        request.meta = {extraHeaders: {'x-uuid': 'my-very-own-uuid'}};
        return {request, error: false};
    }
};
