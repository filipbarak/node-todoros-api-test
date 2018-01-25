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
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'filiptest@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}]

const todoros = [{
    title: 'First test',
    _id: new ObjectID(),
    _creator: userOneId
}, {
    _id: new ObjectID(),
    title: 'Second test',
    _creator: userTwoId
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