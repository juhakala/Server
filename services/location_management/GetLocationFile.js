const async = require("async");
const myf = require('./../my_functions');
const log = require('./../log_management/Write')
const dotenv = require('dotenv');
dotenv.config();

module.exports = function (app, pool, LOCKED) {
	app.post('/api/location', (req, res) => {
		const stamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
		const id = req.query.id;
		if (req.body.locations && id === process.env.API_LOCATION) {
			const arr = {};
			try {
				async.forEach(req.body.locations, function(item, callback) {
					pool.getConnection(function(err, connection) {
						if (err) throw err;
						connection.query(`INSERT INTO coordinates (lon, lat, speed, altitude, date_time, owner) VALUES (?, ?, ?, ?, ?, ?)`, 
							[item.geometry.coordinates[0] * 10000000,
							item.geometry.coordinates[1] * 10000000,
							item.properties.speed,
							item.geometry.altitude,
							item.geometry.timestamp, 
							1],
							function(error, res, fields) {
								connection.release();
								if (error) throw error;
								callback();
						});
						var xy = myf.toXY(item.geometry.coordinates[1], item.geometry.coordinates[0]);
						const key = `${xy[2]}${xy[3]}`;
//						console.log(xy[0], xy[1], xy[2], xy[3]);
						if (!(key in arr))
							arr[key] = [{x: xy[2], y: xy[3]}];
						arr[key].push({input: {create: {width:1, height:1, channels:4, background: {r:0, g:0, b:255, alpha:0.1}}}, blend:'add', top:xy[1], left:xy[0]});
					});
				}, function(err) {
					if (err) throw(err);
					res.status(200);
					res.send('OKK');
					myf.drawToMap(arr, pool, LOCKED, stamp, req.body.locations.length);
				});
			} catch (err) {
				console.log('GetLocationFile: ', err);
			}
		} else {
			res.status(400);
			res.send('Error:  bad syntax');
			log.write({start: stamp, message: `Unauthorized location update`})
		}
	});
}
