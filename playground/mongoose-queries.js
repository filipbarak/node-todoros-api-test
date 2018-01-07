const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todoro} = require('./../server/models/todoro');
const {User} = require('./../server/models/user');

var userId = '5a50bb8dedd33388081fd217';
if (!ObjectID.isValid(userId)) {
    console.log('Id is not valid.')
}
// var id = '5a51651cd3620588205fc101';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todoro.find({
//     _id: id
// }).then((todoros) => {
//     console.log('All', todoros);
// })

// Todoro.findOne({
//     _id: id
// }).then((todoro) => {
//     console.log('One', todoro);
// })

// Todoro.findById(id).then(todoro => {
//     if(!todoro) {
//         return console.log('Id not found')
//     }
//     console.log('By id', todoro)
// }).catch(e => console.log(e));

User.findById(userId).then(user => {
    if(!user) {
        return console.log('User not found.')
    }
    console.log('User found:', user);
}).catch(e => {console.log(e)});