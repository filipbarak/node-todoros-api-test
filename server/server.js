require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todoro} = require('./models/todoro');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json())

app.post('/todoros', authenticate, (req, res) => {
    var todoro = new Todoro({
        title: req.body.title,
        _creator: req.user._id // id of the user from the authenticate middleware
    });

    todoro.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todoros', authenticate, (req, res) => {
    Todoro.find({
        _creator: req.user._id
    }).then((todoros) => {
        res.send({todoros});
    }, (e) => {
        res.status(400).send(e);
    })
});

// GET /todos/id

app.get('/todoros/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({
            message: 'ID is not valid'
        })
    }

    Todoro.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todoro) => {
        if (!todoro) {
            return res.status(404).send({
                message: 'Todoro not found.'
            });
        }
        res.send({todoro});
    }, (e) => {
        res.status(400).send()
    })
})

app.delete('/todoros/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400).send({
            message: 'ID is not valid'
        })
    }

    Todoro.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then(todoro => {
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

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.generateAuthToken();
        // res.send(user);
    }).then((token) => {
        res.header('x-auth', token).send(newUser);
    }).catch(e => {
        res.status(400).send(e);
    })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};