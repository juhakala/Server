// Dependencies
const dotenv = require('dotenv');
dotenv.config();
const url = require('url');
const fs = require('fs');
const http = require('http');
//const https = require('https');
const express = require('express');
const mysql = require('mysql');

const app = express();
function checkOrig(req) {
	const a = req.headers.referer;
	if (a && a === 'http://localhost:3006/') {
		const b = url.parse(a);
		if (b && b.hostname && b.hostname === 'localhost') {
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
//const redir = express();
/*
// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/juhakala.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/juhakala.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/juhakala.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
*/
app.use('/', express.static('./build'));
/*
// redirect http to https
redir.get('/', (req, res) => {
	if (!req.secure) {
		res.redirect('https://' + req.headers.host + req.url);
	}
})
*/
app.get('/api/login', (req, res) => {
	if (checkOrig(req) === true) {
		res.status(200);
		res.set('Content-Type', 'text/plain');
		res.send('You found me?');
	} else {
		res.status(403).end();
	}
});

const start = Date.now();

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
		console.log('count really is: ' ,count);
		res.status(200);
		res.set('Content-Type', 'text/plain');
		pool.getConnection(function(err, connection) {
			if (err) throw err;
			connection.query(`SELECT * FROM messages ORDER BY id DESC LIMIT ?, 6`, [count], function(error, qres, fields) {
				connection.release();
				if (error) throw error;
				res.send(JSON.stringify(qres.reverse()));
			});
		})
	} else {
		res.status(403).end();
	}
});

// Starting both http & https servers
const httpServer = http.createServer(app); //redir
//const httpsServer = https.createServer(credentials, app);

const io = require('socket.io')(httpServer, {
	cors: {
		origin: "http://localhost:3006",
		methods: ["GET", "POST"]
	}
});

httpServer.listen(3001, () => {
	console.log('HTTP Server running on port 3001');
});
/*
httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});
*/

io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */
	console.log('new client connected');
	socket.emit('connection', null);
	socket.on('disconnect', (reason) => {
		console.log('disconnect', socket.id);
	});
	socket.on("chat", (arg) => {
		pool.getConnection(function(err, connection) {
			const send_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
			if (err) throw err;
			arg = escapeHTML(arg);
			connection.query(`INSERT INTO messages (author, content, send_date) VALUES (
				'testuser', ?, '${send_date}')`, [arg],
			function(error, qres, fields) {
				const id = qres.insertId;
				console.log(id);
				connection.release();
				if (error) throw error;
				io.emit('addmessage',  {id:id, author:'testuser', content:arg, send_date:send_date });
			});
		})
	});
});
