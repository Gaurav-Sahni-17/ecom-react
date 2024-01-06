const db = require('../dbmethods/db.js');
module.exports = function (req, res) {
    const { email } = req.body;
    let a = [];
    db.query("Select name,price,description,image,id,cart.quantity as quantity,product.quantity as stock from cart join product on product.id=cart.product_id where email=?", [email], (err, result) => {
        if (result.length > 0) {
            res.status(200);
            res.send(JSON.stringify(result));
        }
        else {
            res.status(201).end();
        }
    })
}