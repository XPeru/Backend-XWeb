//Express is a minimalist web framework for node.js
const express = require('express');
// This allows our server to parse JSONs objects
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const fileSystem = require('graceful-fs');
const dotenv = require('dotenv');
const compression = require('compression');
const errorhandler = require('errorhandler');
const _ = require('underscore');
const debugLogger = require('./utils/debugLogger.js');

const connectMysql = require('./connectMysql.js');
const sqlTools = require('./utils/sql.js');

dotenv.config({ path: '.env' });

var app = express();
app.use(favicon(path.join(__dirname, '../Angular5/src/favicon.ico')));
app.use(compression());
app.use(errorhandler());
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));
app.use(bodyParser.json({ limit: '150mb' }));
var router = express.Router();
app.use('/api', router);
// only for angularjs app -> to be deleted in the near future
app.use(express.static(path.join(__dirname, '../Angular5')));

const loadModule = (folder) => {
	// avoiding IDE's files
	if (folder.charAt(0) === '.') {
		return;
	}
	fileSystem.readdirSync('./modules/' + folder).forEach((file) => {
		if (file.endsWith('.routes.js')) {
			debugLogger.glog('=> Creating route from file: ' + file);
			const mod = require('./modules/' + folder + '/' + file.slice(0, -3));
			debugLogger.glog('route is ' + '/api/' + file.slice(0, -10));
			app.use('/api/' + file.slice(0, -10), mod.router);
		}
	});
};
fileSystem.readdirSync('./modules').forEach(loadModule);

connectMysql.createPoolMysql();


const MAX_DEPTH = 10;
// Delete keys starting by $ to avoid NoSQL injections
var sanitizeInput = function (body, depth = 0) {
	if (body instanceof Object) {
		Object.keys(body).forEach((key) => {
			if (/^\$/.test(key) || depth > MAX_DEPTH) {
				delete body[key];
				throw new Error('Body with nested object detected');
			} else {
				sanitizeInput(body[key], depth + 1);
			}
		});
	}
};

app.use(function (req, res, next) {
	sanitizeInput(req.body);
	sanitizeInput(req.query);
	next();
});

//making underscorejs available for all modules
global._ = _;
global.sqlTools = sqlTools;
app.listen(process.env.PORT, () => {
	debugLogger.glog('All right ! I am alive at Port ' + process.env.PORT);
});
// var PDFDocument = require("pdfkit");
// var blobStream  = require("blob-stream");
// // create a document and pipe to a blob
// var doc = new PDFDocument();
// var stream = doc.pipe(blobStream());
