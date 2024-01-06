import React from "react";
import { createBrowserRouter,createRoutesFromElements,Route,RouterProvider } from "react-router-dom";
import Home from "./components/Home/home";
import Signup from "./components/SignUp/signup";
import Login from "./components/Login/login";
import MailVerify from "./components/MailVerify/mailverify";
import Seller from "./components/Seller/seller";
import Product from "./components/Product/product";
import Changepass from "./components/Changepass/changepass";
import Forgot from "./components/Forgot/forgot"
import CheckMail from "./components/checkMail/checkMail"
import Cart from "./components/Cart/cart"
import SellerSignUp from "./components/SellerSignUp/sellersignup"
import Purchaseform from "./components/Purchaseform/purchaseform"
export default function App(){
    const router = createBrowserRouter(
        createRoutesFromElements(
        <Route>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/verifymail" element={<MailVerify/>}/>
        <Route path="/seller" element={<Seller/>}/>
        <Route path="/product" element={<Product/>}/>
        <Route path="/changepass/:token" element={<Changepass/>}/>
        <Route path="/changepass" element={<Changepass/>}/>
        <Route path="/forgot" element={<Forgot/>}/>
        <Route path="/checkMail" element={<CheckMail/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/sellersignup" element={<SellerSignUp/>}/>
        <Route path="/purchaseform" element={<Purchaseform/>}/>
        </Route>
        )
      );
    return(
    <RouterProvider router={router}></RouterProvider>
    )
}