const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todoro} = require('./../server/models/todoro');
const {User} = require('./../server/models/user');

Todoro.remove({}).then((result) => {
    console.log(result);
})

Todoro.findByIdAndRemove('5a5a8afc8d96b372e1dd32d0').then(todo => {
    console.log(todo);
})