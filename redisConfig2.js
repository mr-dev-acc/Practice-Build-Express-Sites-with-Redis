const redis = require('redis');
const config = require('./config');

const client = redis.createClient({
	// redis[s]://[[username][:password]@][host][:port][/db-number]
	url: `redis://${config.redis_host}:${config.redis_port}`
});

client.on('connect', () => {
	console.log(`Redis Client #2 connected to "redis://${config.redis_host}:${config.redis_port}"`);
});

client.on('error', (err) => {
	console.log('Redis Client #2 Error:', err);
	console.log(`Redis URI #2 is "redis://${config.redis_host}:${config.redis_port}"`);
});

client.connect();

module.exports = client;