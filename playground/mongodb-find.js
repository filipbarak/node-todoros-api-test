// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// Creates a unique ID.
// var obj = new ObjectID(); 

MongoClient.connect('mongodb://localhost:27017/TodorosApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server')
    // db.collection('Todoros').find({_id: new ObjectID('someId')}).toArray().then((docs) => {
    //     console.log('Todoros');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todoros.', err)
    // })

    db.collection('Todoros').find().count().then((count) => {
        console.log('Todoros count:', count);
    }, (err) => {
        console.log('Unable to fetch todoros.', err)
    })

    // db.close();
}); 