const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwt_key = require('../config/jwt_key');

module.exports = class Utils {
    //判斷email格式
    checkEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const result = re.test(email);
        return result;
    }

    checkNull(data) {
        for (var key in data) {
            // 不為空
            return false;
        }
        // 為空值
        return true;
    }

    getRePassword(password) {
        //加密
        let hashPassword = crypto.createHash('sha1');
        hashPassword.update(password);
        const rePassword = hashPassword.digest('hex');
        //   console.log('rePassword: ' + rePassword);
        return rePassword;
    }

    generateToken(payload) {
        return jwt.sign({
            algorithm: 'HS256',
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // token一個小時後過期。
            data: payload
        }, jwt_key.key);
    }

    verifyToken(token) {
        let tokenResult = "";
        const time = Math.floor(Date.now() / 1000);
        return new Promise((resolve, reject) => {
            //判斷token是否正確
            if (token) {
                jwt.verify(token, jwt_key.key, function (err, decoded) {
                    if (err) {
                        tokenResult = undefined;
                        resolve(tokenResult);
                    } else if (decoded.exp <= time) {
                        //token過期判斷
                        tokenResult = undefined;
                        resolve(tokenResult);
                    } else {
                        //若正確
                        tokenResult = decoded.data
                        resolve(tokenResult);
                    }
                })
            }
        });
    }

    
}