var myf = require('./../my_functions');

module.exports = function (app) {
	app.get('/api/login', (req, res) => {
		if (myf.checkOrig(req) === true) {
			res.status(200);
			res.set('Content-Type', 'text/plain');
			res.send('You found me?');
		} else {
			res.status(403).end();
		}
	});
}
