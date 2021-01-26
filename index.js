// Dependencies
const url = require('url');
const fs = require('fs');
const http = require('http');
//const https = require('https');
const express = require('express');

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

/*
	single message obj:
	{ id, author, time, content }
*/
const start = Date.now();
/*
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'juhakala',
  password : 'from file somewhere',
  database : 'my_db'
});
*/

//connection.connect();


app.get('/api/messages/:count', (req, res) => {
	if (checkOrig(req) === true) {
		const count = req.params.count;
		console.log('count is: ' ,count);
		res.status(200);
		res.set('Content-Type', 'text/plain');
		//const data = connection.query(`SELECT * from 'messages' ORDER BY id DESC LIMIT ${count}, 10`, function (error, results, fields) {
			//  if (error) throw error;
			//  console.log('The solution is: ', results[0].solution);
		//tmp data
		const data = [
			{id:12, author:'juha', time:start, content:'mysql tabel is on its way'},
			{id:13, author:'justus', time:start, content:'need usb first for saving data'}
		]
		res.send(JSON.stringify(data));
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