const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const log = require('./services/log_management/Write')
const http = require('http');
const https = require('https');
const express = require('express');
const mysql = require('mysql');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

const redir = express();
redir.get('/', (req, res) => {
	if (!req.secure) {
		res.redirect('https://' + req.headers.host + req.url);
	}
});

const LOCKED = [];
global.free = true;

var pool  = mysql.createPool({
	connectionLimit : 10,
	host     : 'localhost',
	user     : process.env.DB_USER,
	password : process.env.DB_SECRET,
	database : 'juhakala'
});

app.use('/', express.static('./build'));
app.use('/maps', express.static(process.env.MAP_DIR));
require('./services/user_management/Login')(app, pool);
require('./services/chat_management/Messages')(app, pool);
require('./services/map_management/Choose')(app, pool);
require('./services/location_management/GetLocationFile')(app, pool, LOCKED);
require('./services/log_management/Send')(app);
require('./services/check_fibo')(app);

const credentials = {
	key: fs.readFileSync(process.env.LEPV, 'utf8'),
	cert: fs.readFileSync(process.env.LEC, 'utf8'),
	ca: fs.readFileSync(process.env.LECA, 'utf8')
};
const httpServer = http.createServer(process.env.MODE === 'dev' ? app : redir);
const httpsServer = https.createServer(credentials, process.env.MODE === 'dev' ? redir : app);

const io = require('socket.io')(process.env.MODE === 'dev' ? httpServer : httpsServer);

require('./services/chat_management/Connection')(io, pool);

httpServer.listen(process.env.HTTP_PORT, () => {
	console.log('HTTP Server running on port', process.env.HTTP_PORT);
});
httpsServer.listen(process.env.HTTPS_PORT, () => {
	console.log('HTTPS Server running on port', process.env.HTTPS_PORT);
});

process.on('SIGTERM', () => {
	console.info('SIGTERM signal received.');
	console.log('Closing http server.');
	httpServer.close(() => {
		console.log('Http server closed.');
		httpsServer.close(() => {
			console.log('Https server closed.');
			process.exit(0);
		})
	});
});
