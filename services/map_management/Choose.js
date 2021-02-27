const fs = require('fs');
const myf = require('../my_functions');

module.exports = function (app, pool) {
	app.get('/api/maps', (req, res) => {
		if (myf.checkOrig(req) === true) {
			pool.getConnection(function(err, connection) {
				if (err) throw err;
				connection.query(`SELECT * FROM maps`, function(error, qres, fields) {
					connection.release();
					if (err) throw err;
					res.status(200);
					res.send(JSON.stringify(qres));
				});
			});
		}
	}),
	app.get('/api/createmap/:x/:y', (req, res) => {
		res.status(403).end('temporaly block for now'); //tmp for now

/*		const arr = [];
		const style1 = 'add';
		const aa = 0.1;
//		for (var i = 0; i < 100; i++) {
//			arr.push({input: {create: {width:1, height:1, channels:4, background: {r:0, g:0, b:255, alpha:aa}}}, blend:style1, top:i, left:i+24});
//		}
		if(fs.existsSync(`${process.env.MAP_DIR}/base.png`))
			INPUT = fs.readFileSync(`${process.env.MAP_DIR}/base.png`);
		const semiTransparentRedPng = sharp(INPUT)
		.composite(
//			arr
[
			{ input: {create: {width:1000, height:1000, channels:4, background: {r:0, g:0, b:255, alpha:aa}}}, blend:style1, top:4500, left:4500},
			{ input: {create: {width:1000, height:1000, channels:4, background: {r:0, g:0, b:255, alpha:aa}}}, blend:style1, top:4500, left:5000},
			{ input: {create: {width:1000, height:1000, channels:4, background: {r:0, g:0, b:255, alpha:aa}}}, blend:style1, top:5000, left:4500},
			{ input: {create: {width:1000, height:1000, channels:4, background: {r:0, g:0, b:255, alpha:aa}}}, blend:style1, top:5000, left:5000}
]
		)
		.png()
		.toBuffer()
		.then(data => {
			fs.writeFile(`${process.env.MAP_DIR}/base.png`, data, function (err) {
				if (err) throw(err);
				res.status(200);
				res.send('http://localhost:3001/maps/base.png');
			});
		})
*/	});
};
