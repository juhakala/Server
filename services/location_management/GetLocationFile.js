module.exports = function (app) {
	app.post('/api/location', (req, res) => {
		console.log(req);
		res.status(200);
		res.send('Ok, got it');
	});
}