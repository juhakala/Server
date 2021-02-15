var myf = require('./../my_functions');

module.exports = function (app) {
	app.post('/api/login', (req, res) => {
		if (myf.checkOrig(req) === true) {
			console.log(req.body);
			// check MySQL user database


			// generate token 


			const token = {
				token: '0123456789'
			};
			res.status(200);
			res.set('Content-Type', 'application/json');
			res.send(JSON.stringify(token));
		} else {
			res.status(403).end();
		}
	});
}
