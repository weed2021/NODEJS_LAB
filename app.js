const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');

const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('61b5b8e8fccae81215041e2d')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => { console.log(err) })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404)


mongoose
    .connect('mongodb+srv://funix:funix@cluster0.xox99.mongodb.net/shop?retryWrites=true&w=majority')
    .then(()=>{
        User.findOne().then(user =>{ //findOne with no argument => always give back first element
            if(!user){
                const user = new User({
                    name: 'Zack',
                    email: 'zack@gmail.com',
                    cart: {
                        items:[]
                    }
                })
                user.save();  //Save method of mongoose
            }
        })
        
        app.listen('3000')
    })
    .catch(err => { console.log(err) })