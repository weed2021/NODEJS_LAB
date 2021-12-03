const products = [];

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add product page',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    })
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
};


exports.postAddProduct = (req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
    });
}