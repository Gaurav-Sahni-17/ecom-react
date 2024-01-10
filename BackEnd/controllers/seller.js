const db = require('../dbmethods/db.js');
function getsellerrequests(req, res) {
    db.query("Select * from sellers where approved=?", [0], (err, result) => {
        res.end(JSON.stringify(result));
    })
}

function postacceptseller(req, res) {
    const { id, username, email, password } = req.body;
    db.query("Insert into user values (?,?,?,?,?,?)", [username, id, password, 1, "seller", email], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            db.query("Update sellers set approved=? where id=?", [1, id], (err, result) => {
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

function postrejectseller(req, res) {
    const { id } = req.body;
    db.query("Delete from sellers where id=?", [id], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            res.status(200).end();
        }
    })
}


module.exports = { getsellerrequests, postacceptseller, postrejectseller }