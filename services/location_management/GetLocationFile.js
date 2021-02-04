module.exports = function (app, pool) {
	app.post('/api/location', (req, res) => {

		pool.getConnection(function(err, connection) {
			if (err) throw err;
			req.body.locations.forEach(item => {
				connection.query(`INSERT INTO coordinates (lon, lat, speed, altitude, timestamp, owner) VALUES (?, ?, ?, ?, ?, ?)`, 
				[item.geometry.coordinates[1],
				item.geometry.coordinates[0],
				item.properties.speed,
				item.geometry.altitude,
				item.geometry.timestamp, 
				1], 
				function(error, res, fields) {
					connection.release();
					if (error) throw error;
				});
			});
			res.status(200);
			res.send('OK');
			console.log('got it');
		});
	});
}
//		console.log(req.body.locations[0].geometry.coordinates);
//		console.log(req.body.locations[0].properties.timestamp);
//		console.log(req.body.locations[0].properties.altitude);
//		console.log(req.body.locations[0].properties.speed);
//		console.log(req.body.locations[0].properties.locations_in_payload);