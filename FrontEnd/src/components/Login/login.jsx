import { Link,useNavigate } from "react-router-dom"
import { useState,useEffect } from "react"
import  styles from "./login.module.css"
import loginuser from "../../controllers/user/loginuser";
import swal from "sweetalert2"
export default function Login(){
    const navigate=useNavigate();
    const [data,setData]=useState({password:"",email:""})
    const [error,setError]=useState("");
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          let t=token.split(":");
          if(t[1]==="admin")
          {
            navigate('/admin');
          }
          else if(t[1]==="user")
          {
            navigate('/product');
          }
          else if(t[1]==="state")
          {
            navigate('/state');
          }
          else if(t[1]==="city")
          {
            navigate('/city');
          }
          else if(t[1]==="seller")
          {
            navigate('/seller');
          }
          else{
            navigate('/login');
          }        
        }
      }, []);
    function changeData(value){
        return function(e){
        setData({...data,[value]:e.target.value});
        }
    }
     function login(){
        if(data.email!=="" && data.password!=="")
        {
            loginuser(data)
            .then((data)=>{
                if(data==="user"){
                    navigate("/product");
                }
                else if(data==="seller"){
                    navigate("/seller");
                }
                else if(data==="admin"){
                    navigate("/");
                }
                else if(data==="city"){
                    navigate("/");
                }
                else if(data==="state"){
                    navigate("/");
                }
                else if(data==="mailverify"){
                    navigate("/verifymail");
                }
            }).catch((err)=>{
                swal.fire({
                    title:err,
                    icon:"error"
                })
                setError("");
            })
        }
        else{
            setError("Please fill all details");
        }
     }
    return (
        <>
        <h1 className={styles.h1}>Welcome to the portal</h1>
    <Link to="/"><button className={styles.home}>Home</button></Link>
    <div className={styles.outer}>
    <div className={styles.container}>
        <h2>Login</h2>
        <div className={styles.form}>
            <div className={styles.formgroup}>
                <label for="email">Email</label>
                <input type="email" id="email" onChange={changeData("email")} value={data.email} name="email" placeholder="Enter your email"/>
            </div>
            <div className={styles.formgroup}>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" value={data.password} onChange={changeData("password")} placeholder="Enter your password"/>
            </div>
            <div className={styles.loginacc}>
                    <Link to="/signup">New Account</Link>
                    <Link to="/forgot">Forgot Password?</Link>
                </div>
            <div className={styles.btncontainer}>
                <button type="button" onClick={login}>Login</button>
            </div>
        </div>
        <p className={styles.p}>{error}</p>
    </div>
    </div>
        </>
    )
}