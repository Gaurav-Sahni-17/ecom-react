const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
  const {id}=req.body;
  db.query("Delete from product where id=?",[id],(err,result)=>{
    if(result.affectedRows){
        res.status(200).end();
    }
  })
}