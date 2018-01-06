var mongoose = require('mongoose');

var Todoro = mongoose.model('Todoro', {
    title: {
        type: String,
        required: true,
        minlength: 1
    },
    description: {
        type: String
    }
});

module.exports = {Todoro};