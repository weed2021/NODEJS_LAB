const Product = require('../models/product');

const {validationResult} = require('express-validator')

const mongoose = require('mongoose')

const fileHelper = require('../util/file')

exports.getAddProduct = (req, res, next) => {

    res.render('admin/edit-product', {
        pageTitle: 'Add product page',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    // console.log(image);
    if(!image){
        return res.status(404).render('admin/edit-product', {
            pageTitle: 'Add product page',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            errorMessage: 'Attached file is not an image.',
            product: {
                title: title,
                price: price,
                description: description
            },
            validationErrors: []
        });
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).render('admin/edit-product', {
            pageTitle: 'Add product page',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: title,
                price: price,
                description: description
            },
            validationErrors: errors.array()
        });
    }

    const imageUrl = image.path;
    console.log(imageUrl)
    const product = new Product({
        //_id: mongoose.Types.ObjectId('61b5bd061552b99dabea47a4'),
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
            //Well when we call next with an error passed as an argument, then we actually let express know that
            //an error occurred and it will skip all other middlewares and move right away to an error handling
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
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
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId
            },
            validationErrors: errors.array()
        });
    }

    Product.findById(prodId)
        .then(product =>{
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            //If user upload a new image file
            if(image){
                fileHelper.deleteFile(product.imageUrl); //Delete file image with path
                product.imageUrl = image.path;
            }
            
            return product.save()
        })
        .then(() => {
            console.log('Updated Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product=>{
            if(!product){
                return next(new Error("Product not found"));
            }
            fileHelper.deleteFile(product.imageUrl); //Delete file image with path
            return Product.findByIdAndRemove(prodId);
        })
        .then(() => {
            console.log('Deleted Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}