const jwt = require("jsonwebtoken");
const db = require('../dbmethods/db.js');
const sendMail = require("../mailmethods/sendEmail.js");
function getallusers(req, res) {
    db.query("Select * from user", (err, result) => {
        res.end(JSON.stringify(result));
    })
}
function postsignup(req, res) {
    req.body.id = Date.now();
    db.query("Select * from user left join sellers on user.id=sellers.id where user.email=? or sellers.email=?", [req.body.email, req.body.email], (err, result, fields) => {
        if (result.length) {
            res.status(400).end();
        }
        else {
            db.query("Insert into user (username,email,password,id) values (?,?,?,?)", [req.body.username, req.body.email, req.body.password, req.body.id], (err, result, fields) => {
                if (result.affectedRows) {
                    let token = req.body.id;
                    let text = 'Wanna buy some awesome products.';
                    let subject = 'verification';
                    let html = `<h1>Wanna buy some awesome products.<h1><h3>Click below to verify</h3><a href='http://127.0.0.1:3000/verifymail/${token}'>Click Here</a>`;
                    sendMail(req.body.email, subject, text, html, function (err, data) {
                        if (!err) {
                            res.status(200).end();
                        }
                    })
                }
            })
        }
    })
}

function postsellersignup(req, res) {
    req.body.id = Date.now();
    db.query("Select * from user left join sellers on user.id=sellers.id where user.email=? or sellers.email=?", [req.body.email, req.body.email], (err, result, fields) => {
        if (result.length) {
            res.status(400).end();
        }
        else {
            db.query("Insert into sellers (username,email,password,id,gst,brand,aadhar) values (?,?,?,?,?,?,?)", [req.body.username, req.body.email, req.body.password, req.body.id, req.body.gst, req.body.brand, req.body.aadhar], (err, result, fields) => {
                if (result.affectedRows) {
                    res.status(200).end();
                }
            })
        }
    })
}

function postlogin(req, res) {
    db.query("Select * from user where email=? and password=?", [req.body.email, req.body.password], (err, result) => {
        if (result.length) {
            id = result[0].email;
            const token = jwt.sign({ id }, "jwtSecret");
            user = result[0];
            if (user.isverified) {
                if (user.role == "seller") {
                    res.send(JSON.stringify({ "auth": true, "token": token + ":seller", "status": 201 }));
                }
                else if (user.role == "admin") {
                    res.send(JSON.stringify({ "auth": true, "token": token + ":admin", "status": 202 }));
                }
                else if (user.role == "state") {
                    res.send(JSON.stringify({ "auth": true, "token": token + ":state", "status": 203 }));
                }
                else if (user.role == "city") {
                    res.send(JSON.stringify({ "auth": true, "token": token + ":city", "status": 204 }));
                }
                else if (user.role == "user") {
                    res.send(JSON.stringify({ "auth": true, "token": token + ":user", "status": 205 }));
                }
            }
            else {
                res.send(JSON.stringify({ "auth": false, "token": null, "status": 401 }));
            }
        }
        else {
            res.send(JSON.stringify({ "auth": false, "token": null, "status": 402 }));
        }
    })
}


module.exports = { getallusers, postsignup, postsellersignup, postlogin }