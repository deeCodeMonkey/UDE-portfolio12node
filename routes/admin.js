var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/portfolio' });
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "dee139139",
    database: "timesheet_db"
});

connection.connect();

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM projects', (err, rows, fields) => {
        if (err) throw err;
        res.render('admin/index', {
            'projects': rows
        });
    });
});

router.get('/add', function (req, res, next) {
    res.render('admin/add')
});

//enter details for new project
router.post('/add', upload.single('projectimage'), function (req, res, next) {
    // Get Form Values
    var title = req.body.title;
    var description = req.body.description;
    var service = req.body.service;
    var url = req.body.url;
    var client = req.body.client;
    var projectdate = req.body.projectdate;

    // Check Image Upload
    if (req.file) {
        var projectImageName = req.file.filename
    } else {
        var projectImageName = 'noimage.jpg';
    }

    //////data vaildation logic was rejected !!!!!!!!!
    // Form Field Validation
    //req.checkBody('title', 'Title field is required').notEmpty();
    //req.checkBody('service', 'Service field is required').notEmpty();

    //var errors = req.validationErrors();

    //if (errors) {
    //    res.render('admin/add', {
    //        errors: errors,
    //        title: title,
    //        description: description,
    //        service: service,
    //        client: client,
    //        url: url
    //    });
    //} else {
    //    var project = {
    //        title: title,
    //        description: description,
    //        service: service,
    //        client: client,
    //        date: projectdate,
    //        url: url,
    //        image: projectImageName
    //    };
    //}

    var project = {
        title: title,
        description: description,
        service: service,
        client: client,
        date: projectdate,
        url: url,
        image: projectImageName
    };

    var query = connection.query('INSERT INTO projects SET ?', project, function (err, result) {
        if (err){
            console.log('Error: ' + err);
        } else {
            console.log('Success: ' + result);
        }
    });

    //req.flash('success_msg', 'Project Added');

    res.redirect('/admin');
});

//show form with values for editing
router.get('/edit/:id', function (req, res, next) {
    //id= looking for specific project
    connection.query('SELECT * FROM projects WHERE id = ?', req.params.id, (err, rows, fields) => {
        if (err) throw err;
        res.render('admin/edit', {
            //getting back one row, needs to be singular 'project'
            'project': rows[0]
        });
    });
});

//update with edits to project detail
router.post('/edit/:id', upload.single('projectimage'), function (req, res, next) {
    // Get Form Values
    var title = req.body.title;
    var description = req.body.description;
    var service = req.body.service;
    var url = req.body.url;
    var client = req.body.client;
    var projectdate = req.body.projectdate;

    // Check Image Upload
    if (req.file) {
        var projectImageName = req.file.filename
    } else {
        var projectImageName = 'noimage.jpg';
    }

    var project = {
        title: title,
        description: description,
        service: service,
        client: client,
        date: projectdate,
        url: url,
        image: projectImageName
    };

    var query = connection.query('UPDATE projects SET ? WHERE id = '+ req.params.id, project, function (err, result) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log('Success: ' + result);
        }
    });

    res.redirect('/admin');
});

router.delete('/delete/:id', (req, res) => {
    connection.query('DELETE FROM projects WHERE id = ' + req.params.id, function (err, result) {
        if (err) throw err;
        console.log('Deleted' + result.affectedRows + 'rows.');
    });
    res.sendStatus(200);
});

module.exports = router;
