const myf = require('./../my_functions');
const fs = require('fs');

module.exports = function (app, LOCKED) {
	app.get('/api/log', (req, res) => {
		if (myf.checkOrig(req) === true) {
			try {
				const resp = JSON.parse(fs.readFileSync('serverLog.json'));
				res.status(200);
				res.send(resp);
			} catch(err) {
				console.log('Send log:', err);
				res.status(503).end();
			}
		} else {
			res.status(403).end();
		}
	});
}