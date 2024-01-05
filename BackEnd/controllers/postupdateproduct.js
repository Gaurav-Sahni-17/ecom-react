const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
  const {name,description,quantity,price,id}=req.body;
  db.query("Update product set name=?,description=?,quantity=?,price=? where id=?",[name,description,quantity,price,id],(err,result)=>{
    if(result.affectedRows){
        res.status(200).end();
    }
  })
}