const redis = require("redis"),
    client = redis.createClient('redis://redis/0'),
    rateLimiter = require('redis-rate-limiter'),
    limit = rateLimiter.create({
        redis: redis.createClient('redis://redis/0', {enable_offline_queue: false}),
        key: function(x) {
            return x;
        },
        rate: '100/minute'
    });

client.on("error", function(err) {
    console.error("Error " + err);
});

function checkRateLimit(data) {
    return new Promise((resolve, reject) => {
        limit(data, function(err, rate) {
            if (err) {
                reject(err);
            } else {
                if (rate.over) {
                    reject(new Error('Over the limit!'));
                }
                resolve();
            }
        });
    });
}

async function get(prefix, name) {
    let entries = await list(prefix, name);
    let value = 0;
    for (let entry of entries) {
        value += parseFloat(entry.amount);
    }
    return `${value}`;
}

function list(prefix, name) {
    return new Promise((resolve, reject) => {
        client.hgetall(`owe:${prefix}:${name}`, function(err, obj) {
            if (err) {
                reject(err);
            } else {
                let results = [];
                for (let [time, amount] of Object.entries(obj || {})) {
                    results.push({time, amount});
                }
                results.sort(function(a, b) {
                    return parseInt(a.time) - parseInt(b.time);
                });
                resolve(results);
            }
        });
    });
}

function add(prefix, name, value) {
    return new Promise((resolve, reject) => {
        let amount = parseFloat(value);
        if (!isFinite(amount) || isNaN(amount)) {
            return reject(new Error(`Invalid value ${value} for ${prefix}:${name}`));
        }
        client.hmset(`owe:${prefix}:${name}`, {
            [`${Date.now()}`]: `${amount}`
        }, (err) => {
            if (err) {
                reject(err);
            } else {
                // setTimeout(resolve, 100);
                resolve();
            }
        });
    });
}

function call(method, prefix, name, value) {
    return checkRateLimit(prefix).then(() => {
        switch (method) {
            case 'add':
                return add(prefix, name, value);
            case 'list':
                return list(prefix, name);
            case 'get':
                return get(prefix, name);
            default:
                throw new Error(`Method not found: ${method}`);
        }
    });
}

module.exports = {
    call
};
