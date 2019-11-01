const productData = require('../../models/get_all_product_model');

module.exports = class Product{
    getAllProductList(req, res, next) {
        productData().then(result => {
            console.log(result)
            var dataString = JSON.stringify(result);
            var data = JSON.parse(dataString);
            res.render("product_list", {
                title :JSON.stringify(data)
            })
        }, err => {
            res.render("error_and_back", err);
        });
    }

}

