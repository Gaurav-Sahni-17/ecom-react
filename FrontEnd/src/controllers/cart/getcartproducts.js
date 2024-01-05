export default  function getcartproducts(email){ 
    return new Promise((resolve,reject)=>{
        fetch("http://localhost:3000/getcartproducts", {
                method:"POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email:email })
            })
                .then((res) => {
                    if (res.status === 201) {
                        resolve(201);
                    }
                    return res.json();
                }).then((data)=>{
                    resolve(data);
                })
                .catch(()=>{
                    reject("Failed to load products");
                })
    })
 }