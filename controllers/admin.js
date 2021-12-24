const Product = require('../models/product');

const {validationResult} = require('express-validator')

const mongoose = require('mongoose')


exports.getAddProduct = (req, res, next) => {
    // if(!req.session.isLoggedIn){
    //     res.redirect('/');
    // }
    res.render('admin/edit-product', {
        pageTitle: 'Add product page',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
        //activeAddProduct: true
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const errors = validationResult(req);
    // console.log(errors);
    if(!errors.isEmpty()){
        return res.status(404).render('admin/edit-product', {
            pageTitle: 'Add product page',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            validationErrors: errors.array()
        });
    }
    const product = new Product({
        _id: mongoose.Types.ObjectId('61b5bd061552b99dabea47a4'),
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save()
        .then(result => {
            console.log('Created product');
            res.redirect('/admin/products')
        })
        .catch(err => {
            // return res.status(500).render('admin/edit-product', {
            //     pageTitle: 'Add product page',
            //     path: '/admin/edit-product',
            //     editing: false,
            //     hasError: true,
            //     errorMessage: 'Database operation failed, please try again!',
            //     product: {
            //         title: title,
            //         imageUrl: imageUrl,
            //         price: price,
            //         description: description
            //     },
            //     validationErrors: []
            // });
            res.redirect('/500')
        })
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId; //Request Url params

    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit product page',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors:[]
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(404).render('admin/edit-product', {
            pageTitle: 'Edit product page',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId
            },
            validationErrors: errors.array()
        });
    }

    Product.findById(prodId)
        .then(product =>{
            product.title = updatedTitle,
            product.price = updatedPrice,
            product.description = updatedDesc,
            product.imageUrl = updatedImageUrl
            return product.save()
        })
        .then(result => {
            console.log('Updated Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getProducts = (req, res, next) => {
    Product.find()
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            })
        })
        .catch(err => {
            console.log(err)
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('Deleted Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err)
        });

}