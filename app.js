var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var multer = require('multer');
//default destination directory for multer
var upload = multer({ dest: './public/images/portfolio' });

var app = express();

// Route Files
var routes = require('./routes/index');
var admin = require('./routes/admin');
app.use('/', routes);
app.use('/admin', admin);

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Middleware, body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Middleware, handle sessions
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Flash Middleware
app.use(flash());

// Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.listen(3000, function(){
	console.log('Server started');
});
