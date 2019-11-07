const db = require('../connection_db');

module.exports = async function orderProduct(orderList) {
    let result = {};
    let orderAllData  = [];
    let total_price = 0;
    let id = await getOrderID() + 1;

    for (i in orderList['order_info']) {
        let productId = i
        let productQuantity = orderList['order_info'][productId]
        info = await getProductInfo(productId);
        const orderData = {
            'order_id': id,
            'member_id': orderList['memberID'],
            'product_id': productId,
            'order_quantity': productQuantity,
            'order_price': productQuantity * info.price,
            'order_date': orderList['orderDate'],
            'is_complete': 0
        };
        db.query('INSERT INTO order_list SET ?', orderData, function (err, rows) {
            if (err) {
                console.log(err);
                throw "訂單輸入失敗!"
            }
        })
        dataForUser = {
            'id': productId,
            'name': info.name,
            'order_quantity': productQuantity,
            'order_price': orderData['order_price']
        }
        total_price = total_price + orderData['order_price'];
        orderAllData.push(dataForUser);
    }

    result.total_price = total_price;
    result.state = "訂單建立成功。";
    result.orderData = orderAllData
    return result;
}

const getProductInfo = (productID) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product WHERE id = ?', productID, function (err, rows) {
        if (err) {
            console.log(err);
            reject(err);
            return;
        }
        resolve(rows[0]);
        })
    })
}

// 取得訂單id
const getOrderID = () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT MAX(order_id) AS id FROM order_list', function (err, rows, fields) {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        resolve(rows[0].id);
      })
    })
}

