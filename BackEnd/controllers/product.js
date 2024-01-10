const db = require('../dbmethods/db.js');
function getapprovedproducts(req, res) {
    db.query("Select * from product where approved=1", (err, result) => {
        res.end(JSON.stringify(result));
    })
}

function getproductrequests(req, res) {
    db.query("Select * from product where approved=0", (err, result) => {
        res.end(JSON.stringify(result));
    })
}


function postacceptproduct(req, res) {
    const { id } = req.body;
    db.query("Update product set approved=1 where id=?", [id], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            res.status(200).end();
        }
    })
}

function postaddproduct(req, res) {
    let image = req.file.filename;
    let seller_id = JSON.parse(req.body.user).id;
    let id = Date.now();
    const { name, price, desc, quantity } = req.body;
    db.query("Insert into product (id,seller_id,name,price,image,quantity,description) values (?,?,?,?,?,?,?)", [id, seller_id, name, price, image, quantity, desc], (err, result) => {
        if (result.affectedRows) {
            let a = { "image": image, "id": id, "name": name, "price": price, "description": desc, "quantity": quantity };
            res.status(200).send(JSON.stringify(a));
        }
    })
}

function postdeleteproduct(req, res) {
    const { id } = req.body;
    db.query("Delete from product where id=?", [id], (err, result) => {
        if (result.affectedRows) {
            res.status(200).end();
        }
    })
}

function postgetallproductsofseller(req, res) {
    const { id } = req.body;
    db.query("Select * from product where approved=? and seller_id=?", [1, id], (err, result) => {
        if (result.length > 0) {
            res.send(JSON.stringify(result));
        }
    })
}

function postgetcartproducts(req, res) {
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

function postgetfiveproducts(req, res) {
    const { start } = req.body;
    db.query("Select * from product where approved=? limit ?,?", [1, start, 5], (err, result) => {
        if (result) {
            res.send(JSON.stringify(result));
        }
    })
}

function postpendingproductsofseller(req, res) {
    const { id } = req.body;
    db.query("Select * from product where approved=0 and seller_id=?", [id], (err, result) => {
        res.end(JSON.stringify(result));
    })
}

function postrejectedproductsofseller(req, res) {
    const { id } = req.body;
    db.query("Select * from product where approved=-1 and seller_id=?", [id], (err, result) => {
        res.end(JSON.stringify(result));
    })
}


function postrejectproduct(req, res) {
    const { id } = req.body;
    db.query("Update product set approved=-1 where id=?", [id], (err, result) => {
        if (err) {
            res.status(400).end();
        }
        else {
            res.status(200).end();
        }
    })
}


function postupdateproduct(req, res) {
    const { name, description, quantity, price, id } = req.body;
    db.query("Update product set name=?,description=?,quantity=?,price=? where id=?", [name, description, quantity, price, id], (err, result) => {
        if (result.affectedRows) {
            res.status(200).end();
        }
    })
}


module.exports = { getapprovedproducts, getproductrequests, postacceptproduct, postaddproduct, postdeleteproduct, postgetallproductsofseller, postgetcartproducts, postgetfiveproducts, postpendingproductsofseller, postrejectedproductsofseller, postrejectproduct, postupdateproduct }