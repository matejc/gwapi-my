const owe = require('../../owe-machine');

module.exports = {
    call: async function(request) {
        let prefix = request.parameters.prefix.value;
        let name = request.parameters.name.value;
        let total = await owe.call('get', prefix, name);
        return {
            body: {
                total
            }
        };
    }
};
