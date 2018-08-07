/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
const colors = require('colors');

const todayF = (text) => {
	const objToday = new Date(),
		weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		dayOfWeek = weekday[objToday.getDay()],
		domEnder = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'],
		dayOfMonth = (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder[objToday.getDate()] : objToday.getDate() + domEnder[parseFloat(('' + objToday.getDate()).substr(('' + objToday.getDate()).length - 1))],
		months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		curMonth = months[objToday.getMonth()],
		curYear = objToday.getFullYear(),
		curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? '0' + objToday.getHours() : objToday.getHours()),
		curMinute = objToday.getMinutes() < 10 ? '0' + objToday.getMinutes() : objToday.getMinutes(),
		curSeconds = objToday.getSeconds() < 10 ? '0' + objToday.getSeconds() : objToday.getSeconds(),
		curMeridiem = objToday.getHours() > 12 ? 'PM' : 'AM';
	var todayR = curHour + ':' + curMinute + '.' + curSeconds + curMeridiem + ' ' + dayOfWeek + ' ' + dayOfMonth + ' of ' + curMonth + ', ' + curYear;
	return todayR + ' ' + text;
};

const printText = (text, color) => {
	switch (color) {
		case 'yellow':
			return console.warn(colors.yellow(text));
		case 'red':
			return console.warn(colors.red(text));
		case 'magenta':
			return console.warn(colors.magenta(text));
		case 'cyan':
			return console.warn(colors.cyan(text));
		default:
			return console.warn(colors.green(text));
	}
};

function dateGenerator(daoName) {
	this.daoName = daoName;
}


dateGenerator.prototype.printStart = () => {
	printText(todayF(this.daoName) + ' has been added successfully');
};

dateGenerator.prototype.printGreen = (text) => {
	printText(todayF(this.daoName) + '\n' + text);
};

dateGenerator.prototype.printSuccess = () => {
	printText(todayF(this.daoName) + 'Success MySQL query');
};

dateGenerator.prototype.printError = (query, message) => {
	printText(todayF(this.daoName) + '\n' + 'Error executing MySQL query:' + query, 'red');
	printText(todayF(this.daoName) + '\n' + message, 'red');
};

dateGenerator.prototype.printDelete = (text) => {
	printText(todayF(this.daoName) + '\n' + text, 'yellow');
};

dateGenerator.prototype.printUpdate = (text) => {
	printText(todayF(this.daoName) + '\n' + text, 'magenta');
};

dateGenerator.prototype.printSelect = (text) => {
	printText(todayF(this.daoName) + '\n' + text, 'cyan');
};

dateGenerator.prototype.printInsert = (text) => {
	printText(todayF(this.daoName) + '\n' + text, 'magenta');
};

module.exports = dateGenerator;
