// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// Creates a unique ID.
// var obj = new ObjectID(); 

MongoClient.connect('mongodb://localhost:27017/TodorosApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server')
    // db.collection('Todoros').deleteMany({description: 'Madafaker!'}).then((res) => {
    //     console.log(res);
    // });
   
    // db.collection('Todoros').deleteOne({text: 'Ide'}).then(res => {
    //     console.log(res);
    // })

    db.collection('Todoros').findOneAndDelete({completed: false}).then(res => {
        console.log(res);
    })

    // db.close();
}); 