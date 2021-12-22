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
                .hash(password, 12)
                .then(hashPassword => {
                    const user = new User({
                        email: email,
                        password: hashPassword,
                        cart: { items: [] }
                    });
                    return user.save();
                })
                .then(() => {
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup'
    });
};

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error')
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            //Check email valid
            if (!user) {
                req.flash('error','Invalid email or password.')
                return res.redirect('/login');
            }
            //Check password valid
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            //console.log(err);
                            res.redirect('/'); //Be sure session created before redirect
                        })
                    }
                    res.redirect('/login');
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