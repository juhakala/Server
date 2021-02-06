const url = require('url');
const fs = require('fs');
const sharp = require('sharp');
const mw = 10000;
const mh = 10000;
const mll = 24.849444;
const mlr = 25.030556;
const mld = mlr - mll;
const mlb = 60.148333;
const mlbd = mlb * Math.PI / 180;
const wmw = ((mw / mld) * 360) / (2 * Math.PI);
const mosy = (wmw / 2 * Math.log((1 + Math.sin(mlbd)) / (1 - Math.sin(mlbd))));

module.exports = {
	checkOrig: function (req) {
		const a = req.headers.referer;
		if (a && a === process.env.BASE_URL) {
			const b = url.parse(a);
			if (b && b.hostname && b.hostname === process.env.BASE_HOST)
				return (true);
		} else
			return false;
	},
	escapeHTML: function (s) { 
		return s.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
	},
	toXY: function (lat, lon) {
		const x = (lon - mll) * (mw / mld);
		lat = lat * Math.PI / 180;
		const y = mh - ((wmw / 2 * Math.log((1 + Math.sin(lat)) / (1 - Math.sin(lat)))) - mosy);
		return ([parseInt(x), parseInt(y)]);
	},
	drawToMap: function (arr, LOCKED) {
		console.log('valmis');
		LOCKED.push("base.png");
		const input = fs.readFileSync(`${process.env.MAP_DIR}/base.png`);
		const base = sharp(input)
		.composite(arr)
		.png()
		.toBuffer()
		.then(data => {
			fs.writeFile(`${process.env.MAP_DIR}/base.png`, data, function (err) {
				if (err) throw(err);
				LOCKED.slice(LOCKED.indexOf("base.png"), 1);
				console.log('map ready');
			});
		})
	}
};