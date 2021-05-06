var express = require('express');
const db = require('../../config/database');
var authentication = require('../../middlewares/authentication');
var path = require('path');
var app = express();

//use express static folder
app.use(express.static("../../public"));

app.get("/:document", authentication.IsLoggedIn, async(req, res) => {

    let data = [req.params.document];

    let sql = 'SELECT filename FROM document WHERE id=?';


    db.query(sql, data, (err, file) => {
        if (err) {
            return res.status(500).json({
                message: 'Hi ha hagut algun problema a l\'hora de trobar aquest arxiu',
                errors: err
            });
        }

        res.download(path.resolve(__dirname, '../..') + file[0].filename);

    });


});


module.exports = app;