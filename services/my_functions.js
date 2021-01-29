const url = require('url');

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
	}
};