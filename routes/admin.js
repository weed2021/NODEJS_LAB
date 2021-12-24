const path = require('path');

const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const { body } = require('express-validator')

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product',
    [
        body('title')
            .isString()
            .isLength({ min: 5, max: 100 })
            .trim(),
        body('price')
            .trim(),
        body('description')
            .isLength({ min: 5, max: 400 })
            .trim(),
    ],
    isAuth,
    adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title')
            .isString()
            .isLength({ min: 5, max: 100 })
            .trim(),
        body('price')
            .isNumeric()
            .trim(),
        body('description')
            .isLength({ min: 5, max: 400 })
            .trim(),
    ],
    isAuth,
    adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

// module.exports = router
module.exports = router;