const User = require('../models/user');

exports.getLogin = (req,res,next) =>{
    res.render('auth/login',{
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    })
}

exports.postLogin = (req,res,next) =>{
    User.findById('61b5b8e8fccae81215041e2d').then(user =>{
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err =>{
            console.log(err);
            res.redirect('/'); //Be sure session created before redirect
        })
        
    })
    .catch(err =>{ console.log(err)})
}

exports.postLogout = (req,res,next) =>{
    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/');
    })
}