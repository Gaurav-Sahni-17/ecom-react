const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
  const {id}=req.body;
  db.query("Select * from product where approved=? and seller_id=?",[1,id],(err,result)=>{
   if(result.length>0){
    res.send(JSON.stringify(result));
   }
  })
}