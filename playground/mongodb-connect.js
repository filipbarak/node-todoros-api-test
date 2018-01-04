// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// Creates a unique ID.
// var obj = new ObjectID(); 

MongoClient.connect('mongodb://localhost:27017/TodorosApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server')

    // db.collection('Todoros').insertOne({
    //     title: 'Test Todoro',
    //     description: 'What to do here?'
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert todoro', err);
    //     }

    //     console.log(JSON.stringify(res.ops[0]._id.getTimestamp()));
    // })

    db.close();
}); 