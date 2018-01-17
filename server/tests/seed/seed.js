const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todoro} = require('./../../models/todoro');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'filipbarak@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'filiptest@example.com',
    password: 'userTwoPass'
}]

const todoros = [{
    title: 'First test',
    _id: new ObjectID(),
}, {
    _id: new ObjectID(),
    title: 'Second test'
}];

const populateTodoros = (done) => {
    Todoro.remove({}).then(() =>{
        return Todoro.insertMany(todoros);
    }).then (() => {
        done();
    })
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
    
};

module.exports = {todoros, populateTodoros, users, populateUsers};