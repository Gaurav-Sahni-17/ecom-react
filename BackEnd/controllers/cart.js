const db = require('../dbmethods/db.js');
function postaddtocart(req, res) {
    const { id } = req.body;
    const email = req.userId;
    db.query("Select * from cart where email=? and product_id=?", [email, id], (err, result) => {
        if (result.length > 0) {
            res.status(401).end();
        }
        else {
            db.query("Insert into cart values (?,?,?)", [email, id, 1], (err, result) => {
                if (result.affectedRows) {
                    res.status(200).end();
                }
            })
        }
    })
}


function postdecrease(req, res) {
    const { id } = req.body;
    const email = req.userId;
    db.query("Update cart set quantity=quantity-1 where product_id=? and email=?", [id, email], (err, result) => {
        if (result.affectedRows) {
            res.status(200).end();
        }
    })
}

function postincrease(req, res) {
    const { id } = req.body;
    const email = req.userId;
    db.query("Update cart set quantity=quantity+1 where product_id=? and email=?", [id, email], (err, result) => {
        if (result.affectedRows) {
            res.status(200).end();
        }
    })
}

function postpurchasecart(req, res) {
    const { firstname, lastname, pin, state, country, city, address, email, username } = req.body;
    db.query("Select * from cart where email=? ", [email], (err, result) => {
        result.forEach(async (element) => {
            await db.query("Select name,seller_id from product where id=?", [element.product_id], async (err, result2) => {
                await db.query("Insert into orders (email,seller_id,product_id,quantity,state,city,firstname,lastname,productname,address,pincode,country,username) values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [email, result2[0].seller_id, element.product_id, element.quantity, state, city, firstname, lastname, result2[0].name, address, pin, country, username], async (err, result) => {
                    if (err) {
                        res.status(400).end();
                    }
                    else {
                        await db.query("Update product set quantity=quantity-? where id=?", [element.quantity, element.product_id], (err, result) => {
                            if (err) {
                                res.status(400).end();
                            }
                        })
                    }
                })
            });
        })
        db.query("Delete from cart where email=?", [email], (err, result) => {
            if (err) {
                res.status(400).end();
            }
            else {
                res.status(200).end();
            }
        })
    })
}

function postremovefromcart(req, res) {
    const { id } = req.body;
    const email = req.userId;
    db.query("Delete from cart where product_id=? and email=?", [id, email], (err, result) => {
        if (result.affectedRows) {
            res.status(200).end();
        }
    })
}
module.exports = { postaddtocart, postdecrease, postincrease, postpurchasecart, postremovefromcart }