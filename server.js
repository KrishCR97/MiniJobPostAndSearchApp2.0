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
var job_schema = mongoose.Schema({
    title: String,
    description: String,
    keyword: String,
    location: String
});
var applJob_schema = mongoose.Schema({
    appliedJobId: String,
    userName: String
});
var savedJobs_schema = mongoose.Schema({
        SavedJobId: String,
        userName: String
});
var user_model = mongoose.model('users', user_schema);
var job_model = mongoose.model('job', job_schema);
var applJob_model = mongoose.model('appliedJobs', applJob_schema);
var savedJobs_model = mongoose.model('savedJobs',savedJobs_schema)
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
            res.send({ validUser: true, userType: doc[0].userType });  
        }
    });
});

app.post('/saveJob', (req, res) => {
    var jobToSave = new job_model(req.body);
    console.log(req.body);
    jobToSave.save((err, doc) => {
        if (err) {
            res.send({ savedJob: false })
        }
        else {
            res.send({ savedJob: true })
        }
    });
});

app.post('/findJobs', (req, res) => {
    var query = req.body;
    console.log(query);
    job_model.find(query, (err, docs) => {
        if (docs.length != 0) {
            console.log(docs);
            res.send({ jobsFound: true, jobsList: docs })
        } else {
            console.log("Hello");
            res.send({ jobsFound: false });
        }
    });
});

app.post('/saveAppliedJobs', (req, res) => {
    var appliedJobToSave = new applJob_model(req.body);
    console.log(appliedJobToSave);
    appliedJobToSave.save((err, doc) => {
        if (err) {
            res.send({ savedAppliedJob: false });
        }
        else {
            res.send({ savedAppliedJob: true });
            console.log(doc);
        }
    });
});

app.post('/saveSavedJobs',(req,res)=>{
    var savedJobToSave = new savedJobs_model(req.body);
    console.log(savedJobToSave);
    savedJobToSave.save((err, doc) => {
        if (err) {
            res.send({ savedSavedJob: false });
        }
        else {
            res.send({ savedSavedJob: true });
            console.log(doc);
        }
    });
});