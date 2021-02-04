module.exports = function (app, pool) {
	app.post('/api/location', (req, res) => {
		console.log('content-lenght: ', req.headers['content-length']);
//		console.log(req.body);
		if (req.body.locations) {
			console.log('locations-length:', req.body.locations.length)
			req.body.locations.forEach(item => {
				pool.getConnection(function(err, connection) {
					if (err) throw err;
					connection.query(`INSERT INTO coordinates (lon, lat, speed, altitude, date_time, owner) VALUES (?, ?, ?, ?, ?, ?)`, 
						[item.geometry.coordinates[1] * 10000000,
						item.geometry.coordinates[0] * 10000000,
						item.properties.speed,
						item.geometry.altitude,
						item.geometry.timestamp, 
						1], 
						function(error, res, fields) {
							connection.release();
							if (error) throw error;
					});
				});
			});
		}
		res.status(200);
		res.send('OK');
		console.log('got it');
	});
}
//		console.log(req.body.locations[0].geometry.coordinates);
//		console.log(req.body.locations[0].properties.timestamp);
//		console.log(req.body.locations[0].properties.altitude);
//		console.log(req.body.locations[0].properties.speed);
//		console.log(req.body.locations[0].properties.locations_in_payload);
