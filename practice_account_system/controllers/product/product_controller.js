const getProductData = require('../../models/product/get_all_product_model');
const orderProduct = require('../../models/product/order_product_model');

module.exports = class Product{
    getAllProductList(req, res, next) {
        getProductData().then(result => {
            console.log(result)
            var dataString = JSON.stringify(result);
            var data = JSON.parse(dataString);
            res.render("product_list", {
                product_list :data
            })
        }, err => {
            res.render("error_and_back", err);
        });
    }

    orderProductListData(req, res, next) {
        console.log(req.cookies.token);
        console.log(JSON.stringify(req.body));
        const token = req.cookies.token;
        if (utils.checkNull(token) === true) {
            res.render("error_and_back", {
                status: "找不到token!",
                err: "請登入！"
            })
        } else {
            utils.verifyToken(token).then(tokenResult => {
                if (!tokenResult) {
                    res.clearCookie("token");
                    res.render("error_and_back", {
                        status: "token錯誤。",
                        err: "請重新登入。"
                    });
                } else {
                    const id = tokenResult;
                    const orderList = {
                        'memberID': id,
                        'order_info': req.body,
                        'orderDate': onTime(),
                    }
                    orderProduct(orderList).then(result => {
                        console.log(result)
                        res.render("ordered_list", {
                            product_list :result.orderData, 
                            total_price :result.total_price
                        })
                    }, err => {
                        res.render("error_and_back", {
                            status: err.status,
                            err: err.err
                        });
                    });
                }
            });
        }
    }


}


//取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS
const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}

