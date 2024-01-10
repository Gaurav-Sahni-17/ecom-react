const db = require('../dbmethods/db.js');
function getallorders(req, res) {
    db.query("Select * from orders", (err, result) => {
        res.end(JSON.stringify(result));
    })
}

function postacceptorder(req, res) {
    const { id, status } = req.body;
    db.query("Update orders set status=?,dispatchedto=?,dispatchedby=? where order_id=?", [status, null, null, id], (err, result2) => {
        if (err) {
            res.status(400).end();
        }
        else {
            res.status(200).end();
        }
    })
}

function postallordersofuser(req, res) {
    const { email } = req.body;
    db.query("Select * from orders where email=?", [email], (err, result) => {
        res.end(JSON.stringify(result));
    })
}


module.exports = { getallorders, postacceptorder, postallordersofuser }