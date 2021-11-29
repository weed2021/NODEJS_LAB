const express = require('express');

const app = express();

app.use('/',(req, res, next) => {
    console.log('This always runs!');
    next();
});
app.use('/add-product',(req, res, next) => {
    console.log('In another middleware');
    res.send('The "Add Product" Page');
});
app.use('/',(req, res, next) => {
    console.log('In another middleware');
    res.send('Hello from Express.js')
    next();
});




app.listen(3000)

