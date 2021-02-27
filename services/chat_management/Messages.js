var myf = require('./../my_functions');

module.exports = function (app, pool) {
	app.get('/api/messages/:count', (req, res) => {
		if (myf.checkOrig(req) === true) {
			const count = parseInt(req.params.count);
			if (count === NaN)
				res.status(403).end();
			res.status(200);
			res.set('Content-Type', 'text/plain');
			pool.getConnection(function(err, connection) {
			   if (err) throw err;
			   connection.query(`SELECT * FROM messages ORDER BY id DESC LIMIT ?, 8`, [count], function(error, qres, fields) {
				   connection.release();
				   if (error) throw error;
				   res.send(JSON.stringify(qres.reverse()));
			   });
			});
		} else {
			res.status(403).end();
		}
	});
}