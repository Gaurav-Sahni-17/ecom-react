const sendMail = require("../mailmethods/sendEmail.js");
const jwt=require("jsonwebtoken");
const db = require('../dbmethods/db.js');
module.exports = function (req, res) {
    const {email}=req.body;
    db.query("Select id from user where email=?", [email], (err, result) => {
        if (result.length>0) {
            let id=email;
            console.log(id);
            let token=jwt.sign({id},"jwtSecret");
            token=token.replaceAll(".","_____");
            let text = 'Forgot password';
            let subject = 'Forgot password';
            let html = `<h1>Forgot Password<h1><h3>Click below to reset your password</h3><a href='http://localhost:5173/changepass/${token}'>Click Here</a>`;
            sendMail(email, subject, text, html, function (err, data) {
                if (!err) {
                    res.status(200).end();
                }
            })
        }
    })
}