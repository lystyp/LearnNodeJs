const db = require('../connection_db');

module.exports = function orderProduct(orderList) {
    return new Promise(async (resolve, reject) => {
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
                    reject({
                        status: "訂單輸入失敗。",
                        err: "伺服器錯誤，請稍後在試！"
                    });
                    return;
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
        resolve(result);
    })
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

