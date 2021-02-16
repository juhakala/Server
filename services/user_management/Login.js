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

const tokens = async (res, qres, users) => {
	const payload = { username: qres[0].name, email: qres[0].email }
	const accessToken = await token(payload, process.env.ACCESS_TOKEN_SECRET, parseInt(process.env.ACCESS_TOKEN_LIFE));
	const refreshToken = await token(payload, process.env.REFRESH_TOKEN_SECRET, parseInt(process.env.REFRESH_TOKEN_LIFE));
	users[qres[0].name] = { refreshToken: refreshToken };
	const age = parseInt(process.env.REFRESH_TOKEN_LIFE);
	res.cookie("jwt", accessToken, {secure: process.env.MODE === 'dev' ? false : true, maxAge: age * 100})
	res.send()
//	console.log('users', users);
}

module.exports = function (app, users, pool) {
	app.post('/api/login', (req, res) => {
		if (myf.checkOrig(req) === true) {
			try {
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
								console.log(result)
								if (result === true) {
									tokens(res, qres, users);
								} else {
									res.status(401).end();
								}
							});
						}
					});
				});
			} catch(err) {
				console.log('Login: ', err);
			}
		} else {
			res.status(403).end();
		}
	});
}
/*
const saltRounds = 10;
const salt = await bcrypt.hash(req.body.passwd, saltRounds).then(function(hash) {
	return hash;
});
*/