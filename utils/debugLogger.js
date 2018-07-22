/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
const colors = require('colors');

exports.log = (line) => {
	if (process.env.DEBUG === 'true') {
		console.warn(line);
	}
};

exports.glog = (line) => {
	console.warn(colors.green(line));
};

exports.logError = (line) => {
	console.error(colors.red(line));
};
