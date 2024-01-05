const express=require('express');
const session=require('express-session');
const multer=require('multer');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const upload=multer({dest:"uploads"})
const db=require("./dbmethods/db.js")
const postsignup = require('./controllers/postsignup.js');
const postlogin = require('./controllers/postlogin.js');
const verifymail = require('./controllers/verifymail.js');
const checkuser = require('./controllers/checkuser.js');
const postaddproduct = require('./controllers/postaddproduct.js');
const postgetallproductsofseller = require('./controllers/postgetallproductsofseller.js');
const postupdateproduct = require('./controllers/postupdateproduct.js');
const postdeleteproduct = require('./controllers/postdeleteproduct.js');
const getfiveproducts = require('./controllers/postgetfiveproducts.js');
const postchangepass = require('./controllers/postchangepass.js');
const postforgot = require('./controllers/postforgot.js');
const postaddtocart = require('./controllers/postaddtocart.js');
const app=express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static("uploads/"));
app.set('view engine','ejs');
app.use((session({
    secret:"keyboard cat",
    resave:false,
    saveUninitialized:true,
})))
const verifyJWT=(req,res,next)=>{
    const token=req.headers['token'];
        jwt.verify(token,"jwtSecret",(err,decoded)=>{
            if(err)
            {
                return res.status(401).json({ auth: false, message: 'Invalid token' });
            }
            else{
                req.userId=decoded.id;
                next();
            } 
        })
    }

app.post("/signup",postsignup);

app.post("/login",postlogin);

app.get("/checkuser",verifyJWT,checkuser);

app.get("/verifymail/:token",verifymail);

app.post("/addproduct",upload.single('file'),postaddproduct);

app.post("/getallproductsofseller",postgetallproductsofseller);

app.post("/updateproduct",postupdateproduct);

app.post("/deleteproduct",postdeleteproduct);

app.post("/getfiveproducts",getfiveproducts);

app.post("/changepass",verifyJWT,postchangepass);

app.post("/forgot",postforgot);

app.post("/addtocart",verifyJWT,postaddtocart)

db.connect((err)=>{
    if(err)
    {
    throw err;
    }
    console.log("db connected");
    app.listen(3000,()=>{
        console.log("Listening at port 3000");
    })
})
