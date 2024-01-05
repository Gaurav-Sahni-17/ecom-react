const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
  console.log(req.body,req.userId);
  const {id}=req.body;
  const email=req.userId;
  db.query("Select * from cart where email=? and product_id=?",[email,id],(err,result)=>{
    if(result.length>0){
        res.status(401).end();
    }
    else{
    db.query("Insert into cart values (?,?,?)",[email,id,1],(err,result)=>{
        if(result.affectedRows){
            res.status(200).end();
        }
    })
}
  })
}