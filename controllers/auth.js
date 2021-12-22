const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password,12)
                .then(hashPassword =>{
                    const user = new User({
                        email: email,
                        password: hashPassword,
                        cart: { items: [] }
                    });
                    return user.save();
                })
                .then(() =>{
                    res.redirect('/login');
                })
                .catch(err =>{
                    console.log(err);
                })
        })   
        .catch(err =>{
            console.log(err);
        })
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    })
}

exports.postLogin = (req, res, next) => {
    User.findById('61b5b8e8fccae81215041e2d').then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
            console.log(err);
            res.redirect('/'); //Be sure session created before redirect
        })

    })
        .catch(err => { console.log(err) })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/');
    })
}