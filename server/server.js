var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todoro} = require('./models/todoro.js');
var {User} = require('./models/user.js');

var app = express();

app.use(bodyParser.json())

app.post('/todoros', (req, res) => {
    var todoro = new Todoro({
        title: req.body.title
    });

    todoro.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todoros', (req, res) => {
    Todoro.find().then((todoros) => {
        res.send({todoros});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.listen(3000, () => {
    console.log('Started on port 3000');
})

module.exports = {app};