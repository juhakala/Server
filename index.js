// Dependencies
const BASE_URL = 'https://juhakala.com/';
const BASE_HOST = 'juhakala.com';
//const MODE = process.env.NODE_ENV.trim();

const dotenv = require('dotenv');
dotenv.config();
const url = require('url');
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const mysql = require('mysql');

const app = express();
const redir = express();

// Certificate
const credentials = {
	key: fs.readFileSync(process.env.LEPV, 'utf8'),
	cert: fs.readFileSync(process.env.LEC, 'utf8'),
	ca: fs.readFileSync(process.env.LECA, 'utf8')
};

function checkOrig(req) {
	const a = req.headers.referer;
	if (a && a === BASE_URL) {
		const b = url.parse(a);
		if (b && b.hostname && b.hostname === BASE_HOST) {
			return (true);
		}
	} else {
		return false;
	}
};

function escapeHTML(s) { 
    return s.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

app.use('/', express.static('./build'));

app.get('/api/login', (req, res) => {
	if (checkOrig(req) === true) {
		res.status(200);
		res.set('Content-Type', 'text/plain');
		res.send('You found me?');
	} else {
		res.status(403).end();
	}
});

var pool  = mysql.createPool({
	connectionLimit : 10,
	host     : 'localhost',
	user     : process.env.DB_USER,
	password : process.env.DB_SECRET,
	database : 'juhakala'
});

app.get('/api/messages/:count', (req, res) => {
 	if (checkOrig(req) === true) {
		const count = parseInt(req.params.count);
		if (count === NaN)
			res.status(403).end();
		res.status(200);
		res.set('Content-Type', 'text/plain');
		pool.getConnection(function(err, connection) {
			if (err) throw err;
			connection.query(`SELECT * FROM messages ORDER BY id DESC LIMIT ?, 8`, [count], function(error, qres, fields) {
				connection.release();
				if (error) throw error;
				res.send(JSON.stringify(qres.reverse()));
			});
		});
	} else {
		res.status(403).end();
	}
});

// redirect http to https
redir.get('/', (req, res) => {
	if (!req.secure) {
		res.redirect('https://' + req.headers.host + req.url);
	}
})

const httpServer = http.createServer(redir);
const httpsServer = https.createServer(credentials, app);

const io = require('socket.io')(httpsServer);

io.on('connection', (socket) => { 
//	console.log('new client connected');
	socket.emit('connection', null);
	socket.on('disconnect', (reason) => {
		console.log('disconnect', socket.id);
	});
	socket.on("chat", (arg) => {
		arg = arg.slice(0, 255);
		pool.getConnection(function(err, connection) {
			const send_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
			if (err) throw err;
			arg = escapeHTML(arg);
			arg = arg.slice(0, 255);
			connection.query(`INSERT INTO messages (author, content, send_date) VALUES (
				'testuser', ?, '${send_date}')`, [arg],
			function(error, qres, fields) {
				const id = qres.insertId;
//				console.log(id);
				connection.release();
				if (error) throw error;
				io.emit('addmessage',  {id:id, author:'testuser', content:arg, send_date:send_date });
			});
		})
	});
});

httpServer.listen(process.env.HTTP_PORT, () => {
	console.log('HTTP Server running on port', process.env.HTTP_PORT);
});

httpsServer.listen(process.env.HTTPS_PORT, () => {
	console.log('HTTPS Server running on port', process.env.HTTPS_PORT);
});
