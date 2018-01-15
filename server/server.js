require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todoro} = require('./models/todoro.js');
var {User} = require('./models/user.js');

var app = express();
const port = process.env.PORT;

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

// GET /todos/id

app.get('/todoros/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({
            message: 'ID is not valid'
        })
    }
    Todoro.findById(id).then((todoro) => {
        if (!todoro) {
            return res.status(404).send({
                message: 'Todoro not found.'
            });
        }
        res.send({todoro})
    }, (e) => {
        res.status(400).send()
    })
})

app.delete('/todoros/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({
            message: 'ID is not valid'
        })
    }

    Todoro.findByIdAndRemove(id).then(todoro => {
        if (!todoro) {
            return res.status(404).send({
                message: 'That id doesnt exist'
            })
        }
        res.send({todoro});

    }, e => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
})

module.exports = {app};