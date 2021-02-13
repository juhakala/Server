const fs = require('fs');

const newFile = () => {
	const data = { stdout:[], stderr:[] };
	return ( data );
}

module.exports = {
	write: function (message) {
		var data = JSON.parse(fs.readFileSync('serverLog.json'));
		var id = 1;
		if (!data.stdout || !data.stderr) {
			data = newFile();
			id = 1;
		} else
			id = data.stdout[data.stdout.length - 1].id + 1;
		if (data.stdout.length > 10)
			data.stdout.splice(0, 1);
		const stdObj = {
			id: id,
			time: new Date().toISOString().slice(0, 19).replace('T', ' '),
			start: message.start,
			message: message.message
		}
		data.stdout.push(stdObj);
		try {
			fs.writeFile("serverLog.json", JSON.stringify(data, null, 4), 'utf8', function (err) {
				if (err) throw err;
			});
		} catch (err) {
			console.log('write log: ', err);
		}
	}
}