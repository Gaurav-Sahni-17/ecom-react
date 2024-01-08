const db = require('../dbmethods/db.js');
module.exports = function (req, res) {
  const { firstname, lastname, pin, state, country, city, address, email, username } = req.body;
  db.query("Select * from cart where email=? ", [email], (err, result) => {
    result.forEach(async(element) => {
     await db.query("Select name,seller_id from product where id=?", [element.product_id],async (err, result2) => {
        await db.query("Insert into orders (email,seller_id,product_id,quantity,state,city,firstname,lastname,productname,address,pincode,country,username) values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [email, result2[0].seller_id, element.product_id, element.quantity, state, city, firstname, lastname, result2[0].name, address, pin, country, username], async(err, result) => {
          if (err) {
            res.status(400).end();
          }
          else{
            await db.query("Update product set quantity=quantity-? where id=?",[element.quantity,element.product_id],(err,result)=>{
              if(err){
                res.status(400).end();
              }
            })
          }
        })
      });
    })
    db.query("Delete from cart where email=?",[email],(err,result)=>{
          if(err){
            res.status(400).end();
          }
          else{
            res.status(200).end();
          }
    })
  })
}