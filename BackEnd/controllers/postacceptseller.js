const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
    const {id,username,email,password}=req.body;
    db.query("Insert into user values (?,?,?,?,?,?)",[username,id,password,1,"seller",email],(err,result)=>{
        if(err){
            res.status(400).end();
        }
        else{
            db.query("Update sellers set approved=? where id=?",[1,id],(err,result)=>{
                if(err){
                    res.status(400).end();
                }
                else{
                    res.status(200).end();
                }
            })
        }
    })
}