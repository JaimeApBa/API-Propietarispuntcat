var express = require('express');
const db = require('../../config/database');
const fileUpload = require('express-fileupload');
var authentication = require('../../middlewares/authentication');
var path = require('path');
var app = express();

// fileupload middleware use
app.use(fileUpload());


app.get("/:cif/:documentType", authentication.IsLoggedIn, async(req, res) => {

    let data = [req.params.cif];

    let sql = '';

    switch (req.params.documentType) {
        case 'Contractes':
            sql = "SELECT d.id, d.description, d.comments, d.filename, c.numContract, c.initDate, c.endDate, c.provider as cifProvider, p.name AS provider FROM document AS d INNER JOIN contract AS c ON d.id=c.id INNER JOIN provider as p ON p.cif=c.provider WHERE d.community=? GROUP by d.id";
            break;

        case 'Pressupostos':
            sql = "SELECT d.id, d.description, d.comments, d.filename, b.numBudget, b.dateBudget, r.description as refurbishment, b.provider as cifProvider, p.name AS provider FROM document AS d INNER JOIN budget AS b ON d.id=b.id INNER JOIN provider as p ON p.cif=b.provider INNER JOIN refurbishment as r ON r.id=b.refurbishment WHERE d.community=? GROUP by d.id";
            break;

        case 'Factures':
            sql = "SELECT d.id, d.description, d.comments, d.filename, i.numInvoice, i.dateInvoice, r.description as refurbishment, i.provider as cifProvider, p.name AS provider FROM document AS d INNER JOIN invoice AS i ON d.id=i.id INNER JOIN provider as p ON p.cif=i.provider INNER JOIN refurbishment as r ON r.id=i.refurbishment WHERE d.community=? GROUP by d.id";
            break;

        case 'Actes':
            sql = "SELECT d.id, d.description, d.comments, d.filename, b.dateMinute, m.description FROM document AS d INNER JOIN boardminute AS b ON d.id=b.id INNER JOIN meeting as m ON b.meeting=m.id WHERE d.community=? GROUP by d.id";
            break;

        case 'Resums Econòmics':
            sql = "SELECT d.id, d.description, d.comments, d.filename, e.dateSummary FROM document AS d INNER JOIN economicsummary AS e ON d.id=e.id WHERE d.community=? GROUP by d.id";
            break;

        case 'Comunicats':
            sql = "SELECT d.id, d.description, d.filename, d.comments, d.community, s.dateStatement, s.meeting, CONCAT(u.name, ' ', u.fullname) as user FROM statement AS s INNER JOIN document AS d ON s.id=d.id INNER JOIN user AS u ON s.user=u.id WHERE d.community=?";
            break;

        case 'Altres documents':
            sql = "SELECT d.id, d.description, d.comments, d.filename, o.dateDoc FROM document AS d INNER JOIN otherdocuments AS o ON d.id=o.id WHERE d.community=? GROUP by d.id";
            break;

    }

    db.query(sql, data, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: 'Error al buscar documents',
                errors: err
            });
        }
        res.status(200).send({ results: result });

    });


});
app.get("/:cif/:documentType/:string", authentication.IsLoggedIn, async(req, res) => {

    let data = {
        community: req.params.cif,
        string: req.params.string
    };

    let sql = '';

    switch (req.params.documentType) {
        case 'Contractes':
            sql = "SELECT d.id, d.description, d.comments, d.filename, c.numContract, c.initDate, c.endDate, c.provider as cifProvider, p.name AS provider FROM document AS d INNER JOIN contract AS c ON d.id=c.id INNER JOIN provider as p ON p.cif=c.provider WHERE d.description LIKE ? AND d.community=? GROUP by d.id";
            break;

        case 'Pressupostos':
            sql = "SELECT d.id, d.description, d.comments, d.filename, b.numBudget, b.dateBudget, r.description as refurbishment, b.provider as cifProvider, p.name AS provider FROM document AS d INNER JOIN budget AS b ON d.id=b.id INNER JOIN provider as p ON p.cif=b.provider INNER JOIN refurbishment as r ON r.id=b.refurbishment WHERE d.description LIKE ? AND d.community=? GROUP by d.id";
            break;

        case 'Factures':
            sql = "SELECT d.id, d.description, d.comments, d.filename, i.numInvoice, i.dateInvoice, r.description as refurbishment, i.provider as cifProvider, p.name AS provider FROM document AS d INNER JOIN invoice AS i ON d.id=i.id INNER JOIN provider as p ON p.cif=i.provider INNER JOIN refurbishment as r ON r.id=i.refurbishment WHERE d.description LIKE ? AND d.community=? GROUP by d.id";
            break;

        case 'Actes':
            sql = "SELECT d.id, d.description, d.comments, d.filename, b.dateMinute, m.description FROM document AS d INNER JOIN boardminute AS b ON d.id=b.id INNER JOIN meeting as m ON b.meeting=m.id WHERE d.description LIKE ? AND d.community=? GROUP by d.id";
            break;

        case 'Resums Econòmics':
            sql = "SELECT d.id, d.description, d.comments, d.filename, e.dateSummary FROM document AS d INNER JOIN economicsummary AS e ON d.id=e.id WHERE d.description LIKE ? AND d.community=? GROUP by d.id";
            break;

        case 'Comunicats':
            sql = "SELECT d.id, d.description, d.filename, d.comments, d.community, s.dateStatement, s.meeting, CONCAT(u.name, ' ', u.fullname) as user FROM statement AS s INNER JOIN document AS d ON s.id=d.id INNER JOIN user AS u ON s.user=u.id WHERE d.description LIKE ? AND d.community=?";
            break;

        case 'Altres documents':
            sql = "SELECT d.id, d.description, d.filename, d.comments, d.community, s.dateStatement, s.meeting, CONCAT(u.name, ' ', u.fullname) as user FROM statement AS s INNER JOIN document AS d ON s.id=d.id INNER JOIN user AS u ON s.user=u.id WHERE d.description LIKE ? AND d.community=?";
            break;

    }

    db.query(sql, ['%' + data.string + '%', data.community], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar documents',
                errors: err
            });
        }
        res.status(200).send({ results: result });

    });


});


app.post("/:cif", authentication.IsLoggedIn, async(req, res) => {

    var filesrc;
    // init the data of the document
    let data = [];
    let file = req.files['filename'];
    let sql = '';
    const now = new Date().getTime();

    // set the query and part of the data, depending of the document type
    switch (req.body.documentType) {
        case 'Contractes':
            filesrc = '/public/documents/contractes/' + now + ' ' + file.name;
            sql = "CALL createContract(?,?,?,?,?,?,?,?)";
            data.push(req.body.numContract, req.body.initDate, req.body.endDate, req.body.provider);
            break;
        case 'Pressupostos':
            filesrc = '/public/documents/pressupostos/' + now + ' ' + file.name;
            sql = "CALL createBudget(?,?,?,?,?,?,?,?)";
            data.push(req.body.numBudget, req.body.dateBudget, req.body.refurbishment, req.body.provider);
            break;
        case 'Factures':
            filesrc = '/public/documents/factures/' + now + ' ' + file.name;
            sql = "CALL createInvoice(?,?,?,?,?,?,?,?)";
            data.push(req.body.numInvoice, req.body.dateInvoice, req.body.refurbishment, req.body.provider);
            break;
        case 'Actes':
            filesrc = '/public/documents/actes/' + now + ' ' + file.name;
            sql = "CALL createBoardMinute(?,?,?,?,?,?)";
            data.push(req.body.dateMinute, req.body.meeting);
            break;
        case 'Resums Econòmics':
            filesrc = '/public/documents/resums_economics/' + now + ' ' + file.name;
            sql = "CALL createSummary(?,?,?,?,?)";
            data.push(req.body.dateSummary);
            break;
        case 'Comunicats':
            filesrc = '/public/documents/comunicats/' + now + ' ' + file.name;
            sql = "CALL createStatement(?,?,?,?,?,?,?)";
            if (req.body.boardMinute === '') { req.body.boardMinute = null; }
            data.push(req.body.dateStatement, req.body.user, req.body.meeting);
            break;
        case 'Altres documents':
            filesrc = '/public/documents/altres/' + now + ' ' + file.name;
            sql = "CALL createDocs(?,?,?,?,?)";
            data.push(req.body.dateDocs);
            break;

    }
    // get the name of the folder to save the document
    let folderPath = filesrc.substring(0, filesrc.lastIndexOf('/'));
    let dirPath = folderPath.substring(folderPath.lastIndexOf('/') + 1, folderPath.length);

    // set all the data fields to make the query
    data.unshift(req.body.description, req.body.comments, filesrc, req.params.cif);

    await db.query(sql, data, (err, result) => {

        if (result[0] !== undefined && result[0][0].status === 'error' && result[0][0].errno === 1062) {

            return res.status(400).json({
                message: 'Aquestes document ja existeix',
                errors: err
            });
        } else if (result[0] !== undefined && result[0][0].status === 'error') {
            // console.log(result[0][0]);
            return res.status(500).json({
                message: 'Hi ha hagut algun problema a l\'hora de completar el teu registre',
                errors: err
            });
        } else {
            file.mv(path.resolve(__dirname, '../..') + '/public/documents/' + dirPath + '/' + now + ' ' + file.name); // move the file to the public folder
            res.status(200).send({
                message: 'L\'arxiu s\'ha pujat correctament'

            });
        }

    });

});

module.exports = app;