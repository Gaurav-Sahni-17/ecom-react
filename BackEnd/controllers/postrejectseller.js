const db = require('../dbmethods/db.js');
module.exports = function (req, res) {
    const { id} = req.body;
    db.query("Delete from sellers where id=?", [id], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            res.status(200).end();
        }
    })
}