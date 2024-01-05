const sendMail=require("../mailmethods/sendEmail.js");
const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
  req.body.id=Date.now();
  db.query("Select * from user where email=?",[req.body.email],(err,result,fields)=>{
    if(result.length)
    {
        res.status(400).end();   
    }
    else {
        db.query("Insert into user (username,email,password,id) values (?,?,?,?)",[req.body.username,req.body.email,req.body.password,req.body.id],(err,result,fields)=>{
            if(result.affectedRows)
            {
                let token=req.body.id;
                let text='Wanna buy some awesome products.';
                let subject='verification';
                let html=`<h1>Wanna buy some awesome products.<h1><h3>Click below to verify</h3><a href='http://127.0.0.1:3000/verifymail/${token}'>Click Here</a>`;
            sendMail(req.body.email,subject,text,html,function(err,data){
            if(!err)
               {
                   res.status(200).end();
               }
            })
            }
        })
    }
  })
}