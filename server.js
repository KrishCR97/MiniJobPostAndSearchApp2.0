var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.Promise = require('q').Promise;

var bodyParser = require('body-parser');
var cors = require('cors');
var user_schema = mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    phoneNum: Number,
    location: String,
    userType: String
});

var user_model = mongoose.model('users', user_schema);

app.listen(3000, () => {
    console.log('Server running @ 3000')
    mongoose.connect("mongodb://localhost:27017/jobPortalDB")
    var db = mongoose.connection;
    db.on('open', () => {
        console.log('Connected to mongoose db');
    });
    db.on('error', () => {
        console.log('Cannot connect to mongoose db')
    })
});

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send({
        'Yes': true
    });
})

app.post('/saveUser', (req, res) => {
    var userToSave = new user_model(req.body);
    userToSave.save((err, doc) => {
        if (err) {
            res.send({ savedUser: false })
        }
        else {
            res.send({ savedUser: true })
        }
    });
});

app.post('/checkLogin', (req, res) => {
    user_model.find({ userName: req.body.userName, password: req.body.password }, (err, doc) => {
        if (doc.length == 0) {
            res.send({ validUser: false });
        }
        else {
            res.send({ validUser: true , userType : doc[0].userType});
        }
    });
});