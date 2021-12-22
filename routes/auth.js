const express = require('express');

const { check, body } = require('express-validator/check');

const router = express.Router();

const authController = require('../controllers/auth');

const User = require('../models/user');


router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter valid email!')
            .custom((value, { req }) => {
                // if (value === 'test@test.com') {
                //     throw new Error('This email address forbidden.');
                // }

                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject(
                                'Email address already exist, please pick another one!'
                            );
                        }
                    })
            }),
        body(
            'password',
            'Please enter a password with numbers and text and at least 5 characters'
        )
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        })

    ],
    authController.postSignup);

module.exports = router;