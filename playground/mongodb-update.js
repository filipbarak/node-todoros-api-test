// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// Creates a unique ID.
// var obj = new ObjectID(); 

MongoClient.connect('mongodb://localhost:27017/TodorosApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server')
    
    db.collection('Todoros').findOneAndUpdate({
        _id: new ObjectID("5a4f6130f6536900f798bb6a")
    }, 
    {
        $set: {
            completed: false
        }
    }, 
    {
        returnOriginal: false
    }).then(result => {
        console.log(result);
    })

    // db.close();
}); 