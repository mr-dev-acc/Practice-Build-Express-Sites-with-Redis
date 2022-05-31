const express = require('express');
const process = require('process');
const redisClient = require('./redisConfig');
const redisClient2 = require('./redisConfig2');

const app = express();

redisClient.subscribe('@NodeJsChannel', (message, channel) => {
	console.log(`> New message from ${channel}: ${message}`);
});

app.get('/', async(req, res, next) => {
	try {
		const result = await redisClient.exists('REDIS_KEY'); // 0 | 1
		if(result == 0)
			await redisClient.set('REDIS_KEY', 0);
		await redisClient.incr('REDIS_KEY');
		const value = await redisClient.get('REDIS_KEY');
		res.send(`
			<html>
			<head><title>Page</title></head>
			<body><h1>Our Express and Redis Web Application</h1><p>REDIS_KEY:${value}</p></body>
			</html>
		`);
	} catch(err) {
		return next(err);
	}
});

app.get('/test', async(req, res, next) => {
	try {
		await redisClient.set('key', 'value'); // OK
		const value = await redisClient.get('key');
		console.log(value);
		res.send(`
			<html>
				<head><title>Page</title></head>
				<body><h1>Our Express and Redis Web Application</h1><p>key:${value}</p></body>
			</html>
		`);
	} catch(err) {
		return next(err);
	}
});

app.get('/set', async(req, res, next) => {
	try {
		await redisClient.set('REDIS_KEY', 0); // OK
		const value = await redisClient.get('REDIS_KEY');
		res.send(`
			<html>
				<head><title>Page</title></head>
				<body><h1>Our Express and Redis Web Application</h1><p>REDIS_KEY:${value}</p></body>
			</html>
		`);
	} catch(err) {
		return next(err);
	}
});

app.get('/del', async(req, res, next) => {
	try {
		const value = await redisClient.del('REDIS_KEY'); // 0 | 1
		res.send(`
			<html>
				<head><title>Page</title></head>
				<body><h1>Our Express and Redis Web Application</h1><p>REDIS_KEY:${value ? 'Deleted' : 'Not Set'}</p></body>
			</html>
		`);
	} catch(err) {
		return next(err);
	}
});

app.get('/pub/:msg', async(req, res, next) => {
	try {
		await redisClient2.publish('@NodeJsChannel', `Reza says --> ${req.params.msg}`);
		res.send(`
			<html>
				<head><title>Message Sent!</title></head>
				<body><h1>Our Express and Redis Web Application</h1><p>Message Sent!</p></body>
			</html>
		`);
	} catch(err) {
		return next(err);
	}
});

app.use((err, req, res, next) => {
	// console.error('Error:', err);
	res.send(`
		<html>
			<head><title>Page</title></head>
			<body><h1>Our Express and Redis Web Application</h1><p>${err}</p></body>
		</html>
	`);
});

app
.listen(process.argv[2] || 5000)
.on('listening', () => {
    console.log(`Server is running on "http://localhost:${process.argv[2] || 5000}"`);
})
.on('error', (err) => {
    console.error('Server Error:', err);
});;