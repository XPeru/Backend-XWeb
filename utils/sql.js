const _ = require("underscore");
const mysql = require("promise-mysql");

const isId = (field) => {
    return field.name.slice(0, 2) === "id";
};

const isFk = (field) => {
    return field.name.slice(0, 2) === "fk";
};

const buildColumn = (field) => {
    if (isId(field)) {
        return '\n '.concat(field.name).concat(' INT NOT NULL AUTO_INCREMENT,');
    } else if (isFk(field)) {
        return '\n '.concat(field.name).concat(' ').concat('INT') + (field.notNull ? ' NOT NULL,' : ' NULL,');
    } else {
        return '\n '.concat(field.name).concat(' ').concat(field.type) + (field.notNull ? ' NOT NULL,' : ' NULL,');
    }
};

const pk = (pkName, query) => {
    return (pkName ? query.concat('\n '.concat('PRIMARY KEY ( ').concat(pkName).concat(' ),')) : query);
};

const fks = (fkNames, query) => {
    fkNames.forEach((fk) => {
        var fk_table = fk.substring(3);
        var fk_id = 'id_'.concat(fk_table);
        query = query.concat('\n ')
                    .concat('CONSTRAINT FOREIGN KEY (').concat(fk).concat(')')
                    .concat(' REFERENCES ').concat(fk_table)
                    .concat(' ( ').concat(fk_id).concat(' ),');
    });
    return query;
};

exports.createTableQuery = (table) => {
    let query = '';
    query = query.concat('CREATE TABLE IF NOT EXISTS ').concat(table.table_name).concat('  (');
    let pkName;
    const fkNames = [];
    table.fields.forEach((field) => {
        if (isId(field)) {
            pkName = field.name;
        } else if (isFk(field)) {
            fkNames.push(field.name);
        }
        query = query.concat(buildColumn(field));
    });
    query = pk(pkName, query);
    query = fks(fkNames, query);
    query = query.slice(0, -1);
    query = query.concat(')');
    console.info(query);
    return query;
};

exports.insertIntoQuery = (table_name, objs) => {
    if (objs.length === 0) {
        throw new Error("could not insert nothing to database");
    }
    const keys = _.keys(objs[0]);
    // we should find all keys
    _.each(objs, (obj) => {
        const keysInObj = _.keys(obj);
        _.each(keysInObj, (key) => {
            if (! _.contains(keys, key)) {
                keys.push(key);
            }
        });
    });

    let query = ('INSERT INTO ').concat(table_name).concat(' (');
    _.each(keys, (key) => {
        query = query.concat(key).concat(',');
    });
    query = query.slice(0, -1);
    query = query.concat(') VALUES ');

    let end_query = keys.reduce((res, key) => {
        return res.concat('?,');
    }, "");
    end_query = end_query.slice(0, -1);
    end_query = "(".concat(end_query).concat("),");
    var values = [];
    _.each(objs, (obj) => {
        query = query.concat(end_query);
        _.each(keys, (key) => {
            values.push(obj[key]);
        });
    });
    query = query.slice(0, -1);
    return mysql.format(query, values);
};
