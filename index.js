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
		const count = req.params.count;
		console.log('count really is: ' ,count);
		res.status(200);
		res.set('Content-Type', 'text/plain');
		pool.getConnection(function(err, connection) {
			if (err) throw err;
			connection.query(`SELECT * FROM messages ORDER BY id DESC LIMIT ${count}, 1`, function(error, qres, fields) {
				connection.release();
				if (error) throw error;
				res.send(JSON.stringify(qres));
			});
		})
	} else {
		res.status(403).end();
	}
});

// Starting both http & https servers
const httpServer = http.createServer(app); //redir
//const httpsServer = https.createServer(credentials, app);

httpServer.listen(3001, () => {
	console.log('HTTP Server running on port 3001');
});
/*
httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});
*/