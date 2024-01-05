const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
    db.query("Select * from user where email=?",req.userId,(err,result)=>{
        res.end(JSON.stringify(result[0]));
    })
}