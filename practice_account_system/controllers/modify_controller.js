const toRegister = require('../models/register_model');
const toLogin = require('../models/login_model');
const Utils = require('./utils');


utils = new Utils();
module.exports = class Member {
    register(req, res, next) {
        // 獲取client端資料
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: utils.getRePassword(req.body.password),
            create_date: onTime()
        }
        const checkEmail = utils.checkEmail(memberData.email);
        // 不符合email格式
        if (checkEmail === false) {
            res.json({
                result: {
                    status: "註冊失敗。",
                    err: "請輸入正確的Eamil格式。(如1234@email.com)"
                }
            })
        // 若符合email格式
        } else if (checkEmail === true) {
            // 將資料寫入資料庫
            toRegister(memberData).then(result => {
                // 若寫入成功則回傳
                res.json({
                    result: result
                })
            }, (err) => {
                // 若寫入失敗則回傳
                res.json({
                    err: err
                })
            })
        }
    }

    login(req, res, next) {
        // 獲取client端資料
        const memberData = {
            email: req.body.email,
            password: utils.getRePassword(req.body.password),
        }
        toLogin(memberData).then(rows =>{
            if (utils.checkNull(rows ) === true){
                res.json({
                    result:{
                        status:"登入失敗",
                        err:"請輸入正確的帳號或密碼"
                    }
                })
            } else {
                // 產生token
                const token = utils.generateToken(rows[0].id)
                res.setHeader('token', token);
                res.json({
                    result: {
                        status: "登入成功。",
                        loginMember: "歡迎 " + rows[0].name + " 的登入！",
                    }
                })
            }
        }, err => {
            // 若登入失敗則回傳
            res.json({
                err: err
            })
        })
    }

    update(req, res, next) {
        const token = req.headers['token'];
        //確定token是否有輸入
        if (utils.checkNull(token) === true) {
            res.json({
                err: "請輸入token！"
            })
        } else {
            utils.verifyToken(token).then(tokenResult => {
                if (tokenResult === false ) {
                    res.json({
                        result: {
                            status: "token錯誤。",
                            err: "請重新登入。"
                        }
                    })
                } else {
                    res.json({
                        test: "token正確"
                    })
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