var express = require('express'),
    stylus = require('stylus'),
    mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var mongodb_user = process.env.MONGODB_USER
var mongodb_password = process.env.MONGODB_PASSWORD

var app = express();

function compile(str, path) {
    return stylus(str).set('filename', path)
}

app.configure(function() {
    app.set('views', __dirname + '/server/views');
    app.set('view engine', 'jade');
    app.use(stylus.middleware({
        src: __dirname + '/public',
        compile: compile
    }))
    app.use(express.logger('dev'));
    app.use(express.bodyParser())
    app.use(express.static(__dirname + '/public'));
})
if (env === 'development') {
    mongoose.connect('mongodb://localhost/multivision');
} else {
    mongoose.connect('mongodb://' + mongodb_user + ':' + mongodb_password + '@ds031349.mongolab.com:31349/multivision');
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
    console.log('multivision db opened')
})

app.get('/partials/*', function(req, res) {
    res.render('../../public/app/' + req.params);
})

app.get('*', function(req, res) {
    res.render('index', {});
})

var port = process.env.PORT || 3030;
app.listen(port)
