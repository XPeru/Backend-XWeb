const dateGenerator = require("./dateGenerator.js");
const dateGeneratorO = new dateGenerator("tipousuarioDAO");
const fs = require('fs');

const PDFDocument = require('pdfkit');
const router = require("express").Router();

// this should prevent SQL injection
const getArguments = (req) => {
	const queryParams = req.query;
    const filter = queryParams.filter || '';
    const sortOrder = queryParams.sortOrder;
    const pageNumber = parseInt(queryParams.pageNumber) || 0;
    const pageSize = parseInt(queryParams.pageSize);
	const orderBy = queryParams.active || 'ID_TIPO_USUARIO';
	return { filter, sortOrder, pageNumber, pageSize, orderBy };
};

const getTiposUsuarioAsync = async (req) => {
	const query = "CALL SP_SEARCH_ALL('TIPO_USUARIO')";
	dateGeneratorO.printSelect(query);
	const connection = await mySqlPool.getConnection();
	const rows = await connection.query(query);
	connection.release();
	return rows[0];
};

const createTipoUsuarioAsync = async (req) => {
	const tipoUsuario = {
		tipo: req.body.TIPO
	}
	const query = sqlTools.insertIntoQuery('tipo_usuario',[tipoUsuario]);
	dateGeneratorO.printInsert(query);
	const connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return "OK";
};

const updateTipoUsuarioAsync = async (req) => {
	let query = "UPDATE " + "\n" +
	            "   TIPO_USUARIO " + "\n" +
	            "SET " + "\n" +
	            "   TIPO = ? " + "\n" +
	            "WHERE " + "\n" +
	            "   ID_TIPO_USUARIO = ?";
	const table = [req.body.TIPO,
				req.body.ID_TIPO_USUARIO];
	query = mysql.format(query, table);
	dateGeneratorO.printUpdate(query);
	var connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return "OK";
};

const getTipoUsuarioByIdAsync = async (req) => {
	let query = "CALL SP_SEARCH('TIPO_USUARIO','ID_TIPO_USUARIO',?)";
	query = mysql.format(query, [req.params.id_tipo_usuario]);
	dateGeneratorO.printSelect(query);
	const connection = await mySqlPool.getConnection();
	const rows = await connection.query(query);
	connection.release();
	return rows[0];
};

const deleteTipoUsuarioById = async (req) => {
	let query = "DELETE FROM " + "\n" +
	            "   TIPO_USUARIO " + "\n" +
	            "WHERE " + "\n" +
	            "   ID_TIPO_USUARIO=?";
	query = mysql.format(query, [req.params.id_tipo_usuario]);
	dateGeneratorO.printDelete(query);
	var connection = await mySqlPool.getConnection();
	await connection.query(query);
	connection.release();
	return "OK";
};

router.get("/topdf", cf( async(req) => {

    var doc = new PDFDocument();

    doc.pipe(fs.createWriteStream('output.pdf'));
    // draw some text
    doc.fontSize(25)
       .text('Here is some vector graphics...', 100, 80);

    // some vector graphics
    var width_max = 612;
    var height_max = 792;
    var x = 30;
    var w = width_max - 2 * x;
    var h = height_max - 2 * x;
    doc.save().moveTo(x, x)
       .lineTo(x, x + h)
       .lineTo(x + w, x + h)
       .lineTo(x + w, x)
       .lineTo(x, x)
       .stroke();

    /*doc.circle(280, 200, 50)
       .fill("#6600FF");*/

    // an SVG path
    /*doc.scale(0.6)
       .translate(470, 130)
       .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
       .fill('red', 'even-odd')
       .restore();*/

    doc.end();

    res.json ({"dataR" : 'output.pdf'});

}));

router.get('/get', cf(getTiposUsuarioAsync));
router.get('/get/:id', cf(getTipoUsuarioByIdAsync));
router.post('/create', cf(createTipoUsuarioAsync));
router.put('/update', cf(updateTipoUsuarioAsync));
router.delete('/delete/:id', cf(deleteTipoUsuarioById));

exports.router = router;
