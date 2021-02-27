var myf = require('./../my_functions');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function token(payload, secret, expire) {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, secret, { algorithm: "HS256", expiresIn: expire }, function(err, token2) {
			if (err) reject(err);
			else resolve(token2)
		});
	})
}

const tokens = async (res, payload) => {
	const accessToken = await token(payload, process.env.ACCESS_TOKEN_SECRET, parseInt(process.env.ACCESS_TOKEN_LIFE));
	const age = parseInt(process.env.ACCESS_TOKEN_LIFE);
	res.cookie("jwt", accessToken, {secure: process.env.MODE === 'dev' ? false : true, httpOnly: true, maxAge: age * 1000})
	res.send()
}

module.exports = function (app, pool) {
	app.post('/api/login', (req, res) => {
		if (myf.checkOrig(req) === true) {
			pool.getConnection(function(err, connection) {
				if (err) throw err;
				connection.query(`SELECT * FROM users WHERE email=?`, [req.body.email],
				function(error, qres, fields) {
					connection.release();
					if (error) throw error;
					if (qres.length != 1 ) {
						res.status(401).end();
					} else {
						bcrypt.compare(req.body.passwd, qres[0].salt, function(err, result) {
							if (result === true) {
								tokens(res, { username: qres[0].name, email: qres[0].email });
							} else {
								res.status(401).end();
							}
						});
					}
				});
			});
		} else {
			res.status(403).end();
		}
	}),
	app.get('/api/verify', (req, res) => {
		const token = req.cookies.jwt;
		if (!token)
			return res.status(401).end();
			var payload;
		try {
			payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
		} catch (e) {
			if (e instanceof jwt.JsonWebTokenError) { // JWT is unauthorized
				return res.status(401).end()
			}
			return res.status(400).end()
		}
		pool.getConnection(function(err, connection) {
			if (err) throw err;
			connection.query(`SELECT * FROM users WHERE name=?`, [payload.username],
				function(error, qres, fields) {
					connection.release();
					res.send(JSON.stringify(qres[0]));
			});
		});
	}),
	app.post('/api/logout', (req, res) => {
		const token = req.cookies.jwt;
		if (!token)
			return res.status(401).end();
		res.cookie("jwt", '', { httpOnly: true });
		res.send();
		
	}),
	app.post('/api/refresh', (rew, res) => {
		const token = req.cookies.jwt;
		if (!token)
			return res.status(401).end();
		var payload;
		try {
			payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
		} catch (e) {
			if (e instanceof jwt.JsonWebTokenError) {
				return res.status(401).end()
			}
			return res.status(400).end()
		}
		tokens(res, { username: payload.username, email: payload.email });
	})
}
/*
const saltRounds = 10;
const salt = await bcrypt.hash(req.body.passwd, saltRounds).then(function(hash) {
	return hash;
});
*/