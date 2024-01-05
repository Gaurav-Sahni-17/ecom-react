const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
  const {start}=req.body;
  db.query("Select * from product where approved=? limit ?,?",[1,start,5],(err,result)=>{
   if(result){
    res.send(JSON.stringify(result));
   }
  })
}