const secretPass = require('../../secret-pass');

module.exports = {
    call: async function(request) {
        let uuid = request.parameters.uuid.value;
        let value = await secretPass.call('get', uuid);
        return {
            body: {
                value
            }
        };
    }
};
