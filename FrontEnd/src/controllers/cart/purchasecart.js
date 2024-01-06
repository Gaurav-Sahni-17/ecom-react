export default  function purchaseCart(data){ 
    return new Promise((resolve,reject)=>{
         fetch("http://localhost:3000/purchasecart",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(data)
        }).then((res)=>{
            if(res.status===200)
            {
                resolve();
                return;
            }
        }).catch((err)=>{
            reject("Something Went Wrong");
            return;
        })
    })
 }