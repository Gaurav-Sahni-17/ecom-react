const jwt=require("jsonwebtoken");
const db=require ('../dbmethods/db.js');
module.exports=function(req,res){
    db.query("Select * from user where email=? and password=?", [req.body.email, req.body.password], (err, result) => {
        if (result.length) {
            id=result[0].email;
            const token=jwt.sign({id},"jwtSecret");
            user=result[0];
                if (user.isverified) {
                    if (user.role == "seller") {
                        res.send(JSON.stringify({"auth":true,"token":token+":seller","status":201}));
                    }
                    else if (user.role == "admin") {
                        res.send(JSON.stringify({"auth":true,"token":token+":admin","status":202}));
                    }
                    else if (user.role == "state") {
                        res.send(JSON.stringify({"auth":true,"token":token+":state","status":203}));
                    }
                    else if (user.role == "city") {
                        res.send(JSON.stringify({"auth":true,"token":token+":city","status":204}));
                    }
                    else if (user.role == "user") {
                        res.send(JSON.stringify({"auth":true,"token":token+":user","status":205}));
                    }
                }
                else {
                    res.send(JSON.stringify({"auth":false,"token":null,"status":401}));
                }
        }
        else{
            res.send(JSON.stringify({"auth":false,"token":null,"status":402}));
        }
    })
}