const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback =>{
    MongoClient.connect('mongodb+srv://funix:funix@cluster0.xox99.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(client =>{
        
        console.log('Connected');
        callback(client)
    })
    .catch(err => console.log(err))
}

module.exports = mongoConnect;
