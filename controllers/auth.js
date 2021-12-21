
const User = require('../models/user');

exports.getLogin = (req,res,next) =>{
    // const isLoggedIn = req.get('Cookie').trim().split('=')[1];

    // console.log(req.session.isLoggedIn);
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
        res.redirect('/');
    })
    .catch(err =>{ console.log(err)})
}

exports.postLogout = (req,res,next) =>{
    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/');
    })
}