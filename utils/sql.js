const _ = require('underscore');
const mysql = require('promise-mysql');
const debugLogger = require('./debugLogger.js');

const isId = field => field.name.slice(0, 2) === 'id';

const isFk = field => field.name.slice(0, 2) === 'fk';

const buildColumn = (field) => {
	if (isId(field)) {
		return `${field.name} INT NOT NULL AUTO_INCREMENT`;
	} else if (isFk(field)) {
		return `${field.name}${field.complement ? field.complement : ''} INT ${field.notNull ? 'NOT NULL' : 'NULL'}`;
	} else {
		return `${field.name} ${field.type} ${field.notNull ? 'NOT NULL' : 'NULL'}`
			.concat(field.default ? ` DEFAULT ${field.default}` : '');
	}
};

const pk = pkName => mysql.format('PRIMARY KEY ( ?? )', pkName);

const fksF = fks => fks.map((fk) => {
	var fk_table = fk.name.substring(3);
	var fk_id = `id_${fk_table}`;
	return mysql.format(
		'CONSTRAINT FOREIGN KEY (??) REFERENCES ?? ( ?? )',
		[fk.name + (fk.complement ? fk.complement : ''), fk_table, fk_id]);
});

const buildColumnList = (fieldList) => {
	var pkName;
	const fks = [];
	const columnList = [];
	fieldList.forEach((field) => {
		if (isId(field)) {
			pkName = field.name;
		} else if (isFk(field)) {
			fks.push(field);
		}
		columnList.push(buildColumn(field));
	});
	if (pkName) {
		columnList.push(pk(pkName));
	}
	Array.prototype.push.apply(columnList, fksF(fks));
	return columnList.join(',\n ');
};

exports.pmap = (array = [], iterator, { concurrency = 1000 } = {}) => {
	const size = array instanceof Array ? array.length : _.size(array);
	return new Promise((resolve, reject) => {
		var runner = (function* () {
			var promises = [], p;
			//step 1: start a new promise every time runner.next is called
			for (var key in array) {
				promises.push(p = iterator(array[key], key));
				if (size >= concurrency) {
					p.catch(reject).then(() => runner.next()); //start the next promise when one resolves
				}
				yield; //execution waiting for a call to runner.next
			}
			//step 2: everything has been started, we just have to wait for the promises to be completed to return the results
			Promise.all(promises).then(resolve).catch(reject);
		})();
		//init: start the first promises
		var i = 0;
		while (i < concurrency && ! runner.next().done) {
			++i;
		}
	});
};

exports.createTableQuery = (table) => {
	const query = mysql.format(`CREATE TABLE IF NOT EXISTS ?? (${buildColumnList(table.fields)})`, table.table_name);
	debugLogger.log(query);
	return query;
};

const mergeKeys = objs => _.reduce(
	objs,
	(keys, obj) => _.union(keys, _.keys(obj)),
	[]);

const spanValue = (obj, keys) => keys.map(key => obj[key]);

exports.insertIntoQuery = (table_name, objs) => {
	if (objs.length === 0) {
		throw new Error('could not insert nothing to database');
	}
	const keys = mergeKeys(objs);
	const valueQuery = `(${new Array(keys.length).fill('?').join(',')})`;
	const valueListQuery = new Array(objs.length).fill(valueQuery).join(',');
	const values = _.reduce(objs,
		(vs, obj) => vs.concat(spanValue(obj, keys)),
		[]);
	const keyListQuery = `(${new Array(keys.length).fill('??').join(',')})`;
	const query = mysql.format(`INSERT INTO ?? ${keyListQuery} VALUES ${valueListQuery}`,
		[table_name].concat(keys).concat(values));
	// debugLogger.log(query);
	return query;
};

exports.createDatabaseQuery = (name) => {
	const res = mysql.format('CREATE DATABASE IF NOT EXISTS ?? CHARACTER SET utf8 COLLATE utf8_general_ci;', name);
	debugLogger.log(res);
	return res;
};

exports.dropDatabaseQuery = (name) => {
	const res = mysql.format('DROP DATABASE IF EXISTS ??', name);
	debugLogger.log(res);
	return res;
};

exports.alterTableQuery = (data) => {
	const text = data.new_column.notNull ? ' NOT NULL' : ' NULL';
	const query = `ALTER TABLE ${data.table_name} CHANGE COLUMN ${data.old_column_name} ${data.new_column.name} ${data.new_column.type}` + text;
	debugLogger.log(query);
	return query;
};

exports.updateQuery = (table_name, obj, keys) => {
	const idName = `ID_${table_name}`;
	const where = `${obj[idName]} = ${idName}`;
	const keyValueList = [];
	_.each(obj, (value, key) => {
		if (_.contains(keys, key)) {
			keyValueList.push(key);
			keyValueList.push(value);
		}
	});
	const t = `${new Array(keyValueList.length / 2).fill('?? = ?').join(',')}`;
	const query = `UPDATE ?? SET ${t} WHERE ${where}`;

	return mysql.format(query, [table_name].concat(keyValueList));
};

exports.deleteQuery = (table_name, obj) => {
	const idName = `ID_${table_name}`;
	const where = `${obj.id} = ${idName}`;
	const query = `DELETE FROM ?? WHERE ${where}`;
	return mysql.format(query, [table_name]);
};

// sw means script wrapper
exports.sw = (func) => {
	func().then(() => {
	}).catch((err) => {
		debugLogger.logError(err);
	});
};
