module.exports = function (app, pool) {
	app.post('/api/checkFibo', (req, res) => {
		console.log(req.body);
		var number = req.body.number;
		var data;
		if (Math.sqrt(5 * number * number + 4) % 1 === 0 || Math.sqrt(5 * number * number - 4) % 1 === 0)
			data = { answer: "true"};
		else
			data = { answer: "false"};
		res.status(200);
		res.send(data);
	});
}