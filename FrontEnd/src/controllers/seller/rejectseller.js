export default  function rejectseller(data){ 
    console.log(data);
    return new Promise((resolve,reject)=>{
         fetch("http://localhost:3000/rejectseller",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(data)
        }).then((res)=>{
            if(res.status===200)
            {
                resolve();
                return;
            }
            else{
                reject("Something Went Wrong");
                return;    
            }
        }).catch((err)=>{
            reject("Something Went Wrong");
            return;
        })
    })
 }