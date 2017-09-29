const secretPass = require('../../secret-pass');

module.exports = {
    call: async function(request) {
        let value = request.body.value;
        let uuid = await secretPass.call('add', null, value);
        return {
            body: {
                uuid
            }
        };
    }
};
