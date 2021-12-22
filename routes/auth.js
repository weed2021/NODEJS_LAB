const express = require('express');

const { check } = require('express-validator/check');

const router = express.Router();

const authController = require('../controllers/auth');


router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup',
    check('email')
        .isEmail()
        .withMessage('Please enter valid email!')
        .custom((value,{req})=>{
            if(value ==='test@test.com'){
                throw new Error('This email address forbidden.');
            }
            return true;
        }),
    authController.postSignup);

module.exports = router;