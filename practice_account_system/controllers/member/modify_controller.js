const toRegister = require('../../models/member/register_model');
const toLogin = require('../../models/member/login_model');
const toUpdate = require('../../models/member/update_model');
const getInfo = require('../../models/member/get_info_model');
const Utils = require('../utils');


utils = new Utils();
module.exports = class Member {
    mainPage(req, res, next) {
        const token = req.cookies.token
        if (utils.checkNull(token) === false) {
            utils.verifyToken(token).then(tokenResult => {
                if (tokenResult) {
                    const id = tokenResult;
                    getInfo(id).then(result => {
                        res.render("index", {
                            hasLogin: true, 
                            title :'Hello ~' + result[0].name
                        });
                    }, err => {
                        res.clearCookie("token");
                        res.render("error_and_back", err);
                    });
                } else {
                    res.clearCookie("token");
                    res.render("error_and_back", {
                        status: "token錯誤。",
                        err: "token無法解析或已過期"
                    });
                }
            });
        } else {
            res.render("index", {
                hasLogin: false, 
                title :'Not Login yet~'});
        }
        
    }

    logout(req, res, next) {
        res.clearCookie("token");
        res.render("index", {
            hasLogin: false, 
            title :'Not Login yet~'});
    }
    
    registerPage(req, res, next) {
        res.render("register_page", {title :'Register~'});
    }

    updatePage(req, res, next) {
        const token = req.cookies.token
        if (utils.checkNull(token) === false) {
            utils.verifyToken(token).then(tokenResult => {
                if (tokenResult) {
                    const id = tokenResult;
                    getInfo(id).then(result => {
                        res.render("update_page", {
                            name: result[0].name, 
                            title :'Plz update~ ' + result[0].name
                        });
                    }, err => {
                        res.clearCookie("token");
                        res.render("error_and_back", err);
                    });
                } else {
                    res.clearCookie("token");
                    res.render("error_and_back", {
                        status: "token錯誤。",
                        err: "token無法解析"
                    });
                }
            });
        } else {
            res.redirect("/")
        }
    }

    register(req, res, next) {
        res.clearCookie("token");
        // 獲取client端資料
        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: utils.getRePassword(req.body.password),
            create_date: onTime()
        }
        console.log("----- register -----")
        console.log(JSON.stringify(memberData))
        console.log("--------------------")

        const checkEmail = utils.checkEmail(memberData.email);
        // 不符合email格式
        if (checkEmail === false) {
            res.render("error_and_back",  {
                status: "註冊失敗。",
                err: "請輸入正確的Eamil格式。(如1234@email.com)"
            });
        // 若符合email格式
        } else if (checkEmail === true) {
            // 將資料寫入資料庫
            toRegister(memberData).then(result => {
                // 若寫入成功則回傳
                res.render("error_and_back",  {
                    status: JSON.stringify(result),
                    err: ""
                });
            }, (err) => {
                // 若寫入失敗則回傳
                res.render("error_and_back", err);
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
                res.clearCookie("token");
                res.render("error_and_back", {
                    status:"登入失敗",
                    err:"請輸入正確的帳號或密碼"
                });
            } else {
                // 產生token
                const token = utils.generateToken(rows[0].id)
                // res.setHeader('token', token);
                res.cookie('token', token, {signed: false});
                console.log("----- login -----")
                console.log(JSON.stringify(token))
                console.log("--------------------")
                res.redirect("/");
            }
        }, err => {
            // 若登入失敗則回傳
            res.json({
                err: err
            })
        })
    }

    update(req, res, next) {
        const token = req.cookies.token;
        //確定token是否有輸入
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
                    const memberUpdateData = { update_date: onTime() }
                    if (req.body.password) {
                        memberUpdateData.password = utils.getRePassword(req.body.password);
                    }
                    if (req.body.name) {
                        memberUpdateData.name = req.body.name;
                    }

                    toUpdate(id, memberUpdateData).then(result => {
                        res.redirect("/");
                    }, (err) => {
                        res.render("error_and_back", err)
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
