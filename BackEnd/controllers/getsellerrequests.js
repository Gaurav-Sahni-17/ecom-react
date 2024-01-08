const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
    db.query("Select * from sellers where approved=?",[0],(err,result)=>{
        res.end(JSON.stringify(result));
    })
}