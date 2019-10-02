module.exports = class Member {
    productList(req, res, next) {
        res.render("product_list", {
            title: 'Show all products~'
        });
    }

}

