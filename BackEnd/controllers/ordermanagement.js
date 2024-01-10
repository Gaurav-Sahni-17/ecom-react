const db = require('../dbmethods/db.js');
const sendMail = require("../mailmethods/sendEmail.js");
function postdispatchbycity(req, res) {
    const { id, dispatcher_id, email } = req.body;
    db.query("Update orders set status=?,dispatchedto=?,dispatchedby=? where order_id=?", ["Out from City Terminal", "User", dispatcher_id, id], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            let token = id;
            let text = 'Order delivered successfully';
            let subject = 'Confirmation';
            let html = `<h1>Hope you recieve your order.<h1><h3>Click below to confirm</h3><a href='http://127.0.0.1:3000/verifyorder/${token}'>Click Here</a>`;
            sendMail(email, subject, text, html, function (err, data) {
                if (!err) {
                    res.status(200).end();
                }
                else {
                    res.status(400).end();
                }
            })
        }
    })
}


function postdispatchbyseller(req, res) {
    const { id, seller, state } = req.body;
    db.query("Select id from statedetails where state=?", [state], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            db.query("Update orders set status=?,dispatchedto=?,dispatchedby=? where order_id=?", ["Placed", result[0].id, seller, id], (err, result2) => {
                if (err) {
                    res.status(400).end();
                }
                else {
                    res.status(200).end();
                }
            })
        }
    })
}

function postdispatchbystate(req, res) {
    const { id, dispatcher_id, city } = req.body;
    db.query("Select id from citydetails where city=?", [city], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            db.query("Update orders set status=?,dispatchedto=?,dispatchedby=? where order_id=?", ["Out from State Terminal", result[0].id, dispatcher_id, id], (err, result2) => {
                if (err) {
                    res.status(400).end();
                }
                else {
                    res.status(200).end();
                }
            })
        }
    })
}

function postdispatchedorders(req, res) {
    const { id } = req.body;
    db.query("Select * from orders where dispatchedby=?", [id], (err, result) => {
        res.end(JSON.stringify(result));
    })
}

function postdispatchordersofcity(req, res) {
    const { id } = req.body;
    db.query("Select city from citydetails where id=?", [id], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            db.query("Select * from orders where status=? and city=?", ["Arrived City Terminal", result[0].city], (err, result2) => {
                res.end(JSON.stringify(result2));
            })
        }
    })
}

function postdispatchordersofseller(req, res) {
    const { id } = req.body;
    db.query("Select * from orders where seller_id=? and status=?", [id, "Processing"], (err, result) => {
        res.end(JSON.stringify(result));
    })
}

function postdispatchordersofstate(req, res) {
    const { id } = req.body;
    db.query("Select state from statedetails where id=?", [id], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            db.query("Select * from orders where status=? and state=?", ["Arrived State Terminal", result[0].state], (err, result2) => {
                res.end(JSON.stringify(result2));
            })
        }
    })
}

function postupcomingorders(req, res) {
    const { id } = req.body;
    db.query("Select * from orders where dispatchedto=?", [id], (err, result) => {
        res.end(JSON.stringify(result));
    })
}

function cancelorder(req, res) {
    const { id, quantity, productid } = req.body;
    db.query("Update orders set status=?,dispatchedby=?,dispatchedto=? where order_id=?", ["Cancelled", null, null, id], (err, result, fields) => {
        if (!err) {
            if (result.affectedRows) {
                db.query("Update product set quantity=quantity+? where id=?", [quantity, productid], (err, result) => {
                    if (err) {
                        res.status(400).end();
                    }
                    else {
                        res.status(200).end();
                    }
                })
            }
            else {
                res.status(400).end();
            }
        } else {
            req.status(400).end();
        }
    })
}


module.exports = { postdispatchbycity, postdispatchbyseller, postdispatchbystate, postdispatchedorders, postdispatchordersofcity, postdispatchordersofseller, postdispatchordersofstate, postupcomingorders, cancelorder }