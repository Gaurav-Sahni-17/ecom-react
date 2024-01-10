import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import styles from "./signup.module.css"
import signupuser from "../../controllers/user/signupuser";
import swal from "sweetalert2";
export default function Signup() {
    const navigate = useNavigate();
    const [data, setData] = useState({ username: "", password: "", email: "" })
    const [error, setError] = useState("");
    function changeData(value) {
        return function (e) {
            setData({ ...data, [value]: e.target.value });
        }
    }
    function signup() {
        if (data.username !== "" && data.email !== "" && data.password !== "") {
            if (data.password.match("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}")) {
                signupuser(data)
                    .then(() => {
                        navigate("/verifymail");
                    }).catch((err) => {
                        swal.fire({
                            title: err,
                            icon: "error"
                        })
                        setError("");
                    })
            }
            else {
                setError("Password too weak");
            }
        }
        else {
            setError("Please fill all details");
        }
    }
    return (
        <>
            <h1 className={styles.h1}>Welcome to the portal</h1>
            <Link to="/"><button className={styles.home}>Home</button></Link>
            <div className={styles.outer}>
                <div className={styles.container}>
                    <h2>SignUp</h2>
                    <div className={styles.form}>
                        <div className={styles.formgroup}>
                            <label for="username">Username</label>
                            <input type="text" id="username" value={data.username} onChange={changeData("username")} name="username" placeholder="Enter your username" />
                        </div>
                        <div className={styles.formgroup}>
                            <label for="email">Email</label>
                            <input type="email" id="email" onChange={changeData("email")} value={data.email} name="email" placeholder="Enter your email" />
                        </div>
                        <div className={styles.formgroup}>
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" value={data.password} onChange={changeData("password")} placeholder="Enter your password" />
                        </div>
                        <div className={styles.loginacc}>
                            <Link to="/sellersignup">SignUp as Merchant</Link>
                            <Link to="/login">Already a user?</Link>
                        </div>
                        <div className={styles.btncontainer}>
                            <button type="button" onClick={signup}>SignUp</button>
                        </div>
                    </div>
                    <p className={styles.p}>{error}</p>
                </div>
            </div>
        </>
    )
}