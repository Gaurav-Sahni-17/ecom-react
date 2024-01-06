const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
  const {id}=req.body;
  const email=req.userId;
  db.query("Update cart set quantity=quantity-1 where product_id=? and email=?",[id,email],(err,result)=>{
    if(result.affectedRows){
        res.status(200).end();
    }
  })
}