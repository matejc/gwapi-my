const owe = require('../../owe-machine');

module.exports = {
    call: async function(request) {
        let prefix = request.parameters.prefix.value;
        let name = request.parameters.name.value;
        let list = await owe.call('list', prefix, name);
        return {body: list};
    }
};
