const db = require('../connection_db');

module.exports = async function getOrderedList(member_id) {
    let total_list = [];
    let order_id_list = await getOrderIdList(member_id);
    for(i in order_id_list){
        let product_list_for_user = [];
        let total_price = 0;
        
        let product_list = await getProductList(order_id_list[i], member_id);
        for (product_num in product_list){
            data_for_user = {
                'id': product_list[product_num]['product_id'],
                'name': await getProductName(product_list[product_num]['product_id']),
                'order_quantity': product_list[product_num]['order_quantity'],
                'order_price': product_list[product_num]['order_price'],
            }
            total_price = total_price +  product_list[product_num]['order_price'];
            product_list_for_user.push(data_for_user);
        }
        let list_with_prices = {}
        list_with_prices['product_list'] = product_list_for_user
        list_with_prices['total_price'] = total_price
        list_with_prices['order_id'] = order_id_list[i]
        total_list.push(list_with_prices); 
    }
    return total_list
}


const getProductName = (productID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT name FROM product WHERE id = ?', productID, function (err, rows) {
        if (err) {
            console.log(err);
            reject(err);
            return;
        }
        resolve(rows[0]["name"]);
        })
    })
}

const getOrderIdList = (member_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT DISTINCT order_id FROM order_list where member_id = ?',member_id, function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            let l = [];
            for (i in rows){
                l.push(rows[i]['order_id']);
            }
            resolve(l);
        });
    })
}

const getProductList = (order_id, member_id) => {
    console.log("getProductList : order_id = " + order_id + ", member_id = " + member_id);
    return new Promise((resolve, reject) => {
        db.query('SELECT product_id, order_quantity, order_price FROM order_list where order_id = ? and member_id = ?',[order_id, member_id], function (err, rows) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(rows);
        });
    })
}