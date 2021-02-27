const url = require('url');
const fs = require('fs');
const sharp = require('sharp');
const async = require("async");
const log = require('./log_management/Write')

const mw = 10000;
const mh = 10000;
const mll = 24.849444;
const mlr = 25.030556;
const mld = mlr - mll;
const mlb = 60.148333;
const mlbd = mlb * Math.PI / 180;
const wmw = ((mw / mld) * 360) / (2 * Math.PI);
const mosy = (wmw / 2 * Math.log((1 + Math.sin(mlbd)) / (1 - Math.sin(mlbd))));

function createMap(name, arr, LOCKED) {
	arr.shift();
	const picture = sharp({
		create: {
			width: 10000,
			height: 10000,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 1 }
		}
	})
	.composite(arr)
	.png()
	.toBuffer()
	.then(data => {
		fs.writeFileSync(`${process.env.MAP_DIR}/${name}`, data);
	});
	return (picture);
}

function colorMap(name, arr, LOCKED) {
	arr.shift();
	var input = null;
	try {
		input = fs.readFileSync(`${process.env.MAP_DIR}/${name}`);
	} catch(err) {
		if (err.code === 'ENOENT') {
			console.log(`colorMap, file not found (${name}): `, err);
			input = { create: { width: 10000, height: 10000, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } } }
		} else {
			throw err;
		}
	}
	const picture = sharp(input)
	.composite(arr)
	.png()
	.toBuffer()
	.then(data => {
		fs.writeFileSync(`${process.env.MAP_DIR}/${name}`, data);
	});
	return (picture);
}

module.exports = {
	checkOrig: function (req) {
		const a = req.headers.referer;
		if (a && a === process.env.BASE_URL) {
			const b = url.parse(a);
			if (b && b.hostname && b.hostname === process.env.BASE_HOST)
				return (true);
		} else
			return false;
	},
	escapeHTML: function (s) { 
		return s.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
	},
	toXY: function (lat, lon) {
		const x = (lon - mll) * (mw / mld);
		lat = lat * Math.PI / 180;
		const y = mh - ((wmw / 2 * Math.log((1 + Math.sin(lat)) / (1 - Math.sin(lat)))) - mosy);
		
		return ([
			parseInt(x < 0 ? 10000 + x % 10000: x % 10000),
			parseInt(y < 0 ? 10000 + y % 10000: y % 10000),
			Math.floor(x/10000),
			Math.floor(y/10000)
		]);
	},
	drawToMap: function (obj, pool, LOCKED, stamp, len) {
		async.eachSeries(obj, function(arr, callback) {
			pool.getConnection(function(err, connection) {
				const values = { x:arr[0].x, y:arr[0].y};
				if (err) throw err;
				connection.query(`SELECT path FROM maps WHERE x = ? AND y = ?`, [arr[0].x, arr[0].y],
				function(error, res, fields) {
					connection.release();
					if (error) throw error;
					if (!res[0]) {
						pool.getConnection(function(err, connection) {
							if (err) throw err;
							connection.query(`INSERT INTO maps (path, x, y) VALUES (?, ?, ?)`, [`${values.x},${values.y}.png`, values.x, values.y],
							function(error, res, fields) {
								connection.release();
								if (error) throw error;
								createMap(`${values.x},${values.y}.png`, arr, LOCKED).then (data => {
									log.write({ start: stamp, message: `New map(${values.x},${values.y}}) generated` });
									callback();
								});
							});
						});
					} else {
						colorMap(res[0]['path'], arr, LOCKED).then(data => {
							callback();
						});
					}
				});
			});
		}, function(err) {
			if (err) throw(err);
			log.write({start: stamp, message: `Maps updated: +${len} points`})
		});
	}
};
