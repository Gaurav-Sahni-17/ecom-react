const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
  let image=req.file.filename;
  let seller_id=JSON.parse(req.body.user).id;
  let id=Date.now();
  const {name,price,desc,quantity}=req.body;
  db.query("Insert into product (id,seller_id,name,price,image,quantity,description) values (?,?,?,?,?,?,?)",[id,seller_id,name,price,image,quantity,desc],(err,result)=>{
    if(result.affectedRows)
    {
      let a={"image":image,"id":id,"name":name,"price":price,"description":desc,"quantity":quantity};
      res.status(200).send(JSON.stringify(a));
    }
  })
}