const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
    const {token}=req.params;
    db.query("Update user set isverified=? where id=?",[1,token],(err,result,fields)=>{
        if(result.affectedRows)
        {
            res.redirect("http://localhost:5173");
        }
        else{
            res.end("<h1>404 Page not Found</h1>");
        }
    })
 }