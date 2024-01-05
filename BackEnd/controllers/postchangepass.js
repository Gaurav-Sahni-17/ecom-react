const sendMail = require("../mailmethods/sendEmail.js");
const db = require('../dbmethods/db.js');
module.exports = function (req, res) {
    const {password}=req.body;
    const id=req.userId;
    console.log(id,password)
    db.query("Update user set password=? where email=?", [password,id], (err, result) => {
        if (result.affectedRows) {
            let text = 'password changed';
            let subject = 'Password changed';
            let html = `<h1>Password Changed.<h1><h3>Your password has been changed successfully</h3>`;
            sendMail(id, subject, text, html, function (err, data) {
                if (!err) {
                    res.status(200).end();
                }
            })
        }
    })
}