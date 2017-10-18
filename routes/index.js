var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "dee139139",
    database: "timesheet_db"
});

connection.connect();

router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM projects', (err, rows, fields) => {
        if (err) throw err;
        res.render('index', {
            'projects': rows
        });
    });
});

router.get('/details/:id', function (req, res, next) {
    //id= looking for specific project
    connection.query('SELECT * FROM projects WHERE id = ?', req.params.id, (err, rows, fields) => {
        if (err) throw err;
        res.render('details', {
            //getting back one row, needs to be singular 'project'
            'project': rows[0]
        });
    });
});


module.exports = router;
