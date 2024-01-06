export default  function decreaseCart(id,token){ 
    return new Promise((resolve,reject)=>{
         fetch("http://localhost:3000/decrease",{
            method:"POST",
            headers:{"token":token,'Content-Type':'application/json'},
            body:JSON.stringify({id:id})
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