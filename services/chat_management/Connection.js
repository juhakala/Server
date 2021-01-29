
module.exports = function (io, pool) {
	io.on('connection', (socket) => { 
		socket.emit('connection', null);
		socket.on('disconnect', (reason) => {});
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
					const id = qres.insertId;
					connection.release();
					if (error) throw error;
					io.emit('addmessage',  {id:id, author:'testuser', content:arg, send_date:send_date });
				});
			})
		});
	});
}