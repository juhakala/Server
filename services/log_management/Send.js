const myf = require('./../my_functions');
const fs = require('fs');
const log = require('./Write')

module.exports = function (app, LOCKED) {
	app.get('/api/log', (req, res) => {
//		const stamp = {};
//		stamp.start = new Date().toISOString().slice(0, 19).replace('T', ' ');
//		stamp.message = "new stdout try on message";
		if (myf.checkOrig(req) === true) {
			try {
				const resp = JSON.parse(fs.readFileSync('serverLog.json'));
			} catch(err) {
				console.log('Send log:', err);
			}
			res.status(200);
			res.send(resp);
		} else {
			res.status(403).end();
		}
	});
}