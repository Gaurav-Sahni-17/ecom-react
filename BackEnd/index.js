const express = require('express');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const upload = multer({ dest: "uploads" })
const db = require("./dbmethods/db.js")
const {postchangepass,postforgot}=require("./controllers/passwordmanagement.js");
const {postdispatchbycity,postdispatchbyseller,postdispatchbystate,postdispatchedorders,postdispatchordersofcity,postdispatchordersofseller,postdispatchordersofstate,postupcomingorders,cancelorder}=require("./controllers/ordermanagement.js")
const {getallorders,postacceptorder,postallordersofuser}=require("./controllers/order.js");
const { postaddtocart, postdecrease, postincrease, postpurchasecart, postremovefromcart }=require("./controllers/cart.js");
const {getsellerrequests,postacceptseller,postrejectseller}=require("./controllers/seller.js");
const { getallusers, postsignup, postsellersignup, postlogin } = require("./controllers/user.js");
const { getapprovedproducts, getproductrequests, postacceptproduct, postaddproduct, postdeleteproduct, postgetallproductsofseller, postgetcartproducts, postgetfiveproducts, postpendingproductsofseller, postrejectedproductsofseller, postrejectproduct, postupdateproduct } = require('./controllers/product.js');
const {verifymail,verifyorder,checkuser}=require("./controllers/verification.js")
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("uploads/"));
const verifyJWT = (req, res, next) => {
    const token = req.headers['token'];
    jwt.verify(token, "jwtSecret", (err, decoded) => {
        if (err) {
            return res.status(401).json({ auth: false, message: 'Invalid token' });
        }
        else {
            req.userId = decoded.id;
            next();
        }
    })
}

app.post("/signup", postsignup);

app.post("/login", postlogin);

app.get("/checkuser", verifyJWT, checkuser);

app.get("/verifymail/:token", verifymail);

app.get("/verifyorder/:token", verifyorder);

app.post("/addproduct", upload.single('file'), postaddproduct);

app.post("/getallproductsofseller", postgetallproductsofseller);

app.post("/updateproduct", postupdateproduct);

app.post("/deleteproduct", postdeleteproduct);

app.post("/getfiveproducts", postgetfiveproducts);

app.post("/changepass", verifyJWT, postchangepass);

app.post("/forgot", postforgot);

app.post("/addtocart", verifyJWT, postaddtocart);

app.post("/getcartproducts", postgetcartproducts);

app.post("/removefromcart", verifyJWT, postremovefromcart);

app.post("/increase", verifyJWT, postincrease);

app.post("/decrease", verifyJWT, postdecrease);

app.post("/sellersignup", postsellersignup);

app.post("/purchasecart", postpurchasecart);

app.get("/getallusers", getallusers);

app.get("/getsellerrequests", getsellerrequests);

app.post("/rejectseller", postrejectseller)

app.post("/acceptseller", postacceptseller)

app.get("/getapprovedproducts", getapprovedproducts);

app.get("/getproductrequests", getproductrequests);

app.post("/acceptproduct", postacceptproduct);

app.post("/rejectproduct", postrejectproduct);

app.get("/getallorders", getallorders);

app.post("/pendingproductsofseller", postpendingproductsofseller);

app.post("/rejectedproductsofseller", postrejectedproductsofseller);

app.post("/dispatchordersofseller", postdispatchordersofseller);

app.post("/dispatchedorders", postdispatchedorders);

app.post("/dispatchbyseller", postdispatchbyseller);

app.post("/dispatchordersofstate", postdispatchordersofstate);

app.post("/upcomingorders", postupcomingorders);

app.post("/acceptorder", postacceptorder);

app.post("/dispatchbystate", postdispatchbystate);

app.post("/dispatchordersofcity", postdispatchordersofcity);

app.post("/dispatchbycity", postdispatchbycity);

app.post("/allordersofuser", postallordersofuser);

app.post("/cancelorder", cancelorder);

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("db connected");
    app.listen(3000, () => {
        console.log("Listening at port 3000");
    })
})
