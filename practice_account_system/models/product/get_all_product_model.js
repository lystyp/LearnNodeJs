const db = require('../connection_db');

module.exports = function getProductData() {
    let result = {};
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM product', function (err, rows) {
            if (err) {
                console.log(err);
                result.status = "取得全部訂單資料失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }
            resolve(rows);
        })
    })
}