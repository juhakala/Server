var myf = require('./../my_functions');
var numClients = 0;
module.exports = function (io, pool) {
	io.on('connection', (socket) => {
		numClients++;
		socket.emit('connection', {numClients: numClients});
		socket.on('disconnect', (reason) => {
			numClients--;
		});
		socket.on("chat", (arg) => {
		arg = arg.slice(0, 255);
			pool.getConnection(function(err, connection) {
				const send_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
				if (err) throw err;
				arg = myf.escapeHTML(arg);
				arg = arg.slice(0, 255);
				connection.query(`INSERT INTO messages (author, content, send_date) VALUES (
					'testuser', ?, '${send_date}')`, [arg],
				function(error, qres, fields) {
					connection.release();
					const id = qres.insertId;
					if (error) throw error;
					io.emit('addmessage',  {id:id, author:'testuser', content:arg, send_date:send_date });
				});
			})
		});
	});
}
