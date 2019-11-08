const db = require('../connection_db');

module.exports = async function deleteOrderedList(order_id, member_id) {
    await deleteList(order_id, member_id);
}

const deleteList = (order_id, member_id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM order_list where order_id = ? and member_id = ?', [order_id, member_id], function (err, rows) {
        if (err) {
            console.log(err);
            reject(err);
            return;
        }
        resolve();
        })
    })
}
