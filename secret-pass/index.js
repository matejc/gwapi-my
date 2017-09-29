const redis = require("redis"),
    uuidV4 = require('uuid/v4'),
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

function get(uuid) {
    return new Promise((resolve, reject) => {
        client.get(`secret-pass:${uuid}`, (err, value) => {
            if (err) {
                reject(err);
            } else {
                resolve(value);
            }
        });
    })
    .then((value) => {
        return new Promise((resolve, reject) => {
            client.del(`secret-pass:${uuid}`, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    });
}

function add(value) {
    return new Promise((resolve, reject) => {
        let ttl = 600;
        let uuid = uuidV4();
        client.set(`secret-pass:${uuid}`, value, "EX", ttl, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({uuid, ttl});
            }
        });
    });
}

function call(method, uuid, value) {
    return checkRateLimit(uuid || "new").then(() => {
        switch (method) {
            case 'add':
                return add(value);
            case 'get':
                return get(uuid);
            default:
                throw new Error(`Method not found: ${method}`);
        }
    });
}

module.exports = {
    call
};
