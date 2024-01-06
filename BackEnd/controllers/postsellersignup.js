const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
  req.body.id=Date.now();
  db.query("Select * from user left join sellers on user.id=sellers.id where user.email=? or sellers.email=?",[req.body.email,req.body.email],(err,result,fields)=>{
    if(result.length)
    {
        res.status(400).end();   
    }
    else {
        db.query("Insert into sellers (username,email,password,id,gst,brand,aadhar) values (?,?,?,?,?,?,?)",[req.body.username,req.body.email,req.body.password,req.body.id,req.body.gst,req.body.brand,req.body.aadhar],(err,result,fields)=>{
            if(result.affectedRows)
            {
                   res.status(200).end();
            }
        })
    }
  })
}