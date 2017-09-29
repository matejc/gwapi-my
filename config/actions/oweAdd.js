const owe = require('../../owe-machine');

module.exports = {
    call: async function(request) {
        let prefix = request.parameters.prefix.value;
        let name = request.parameters.name.value;
        let value = request.body.value;
        try {
            await owe.call('add', prefix, name, value);
            return {body: 'OK'};
        } catch (err) {
            console.error(err);
            throw "BadRequest";
        }
    }
};
