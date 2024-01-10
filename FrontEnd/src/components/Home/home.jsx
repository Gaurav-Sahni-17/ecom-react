import { Link } from "react-router-dom"
import style1 from "./home.module.css"
export default function Home() {
    return (
        <>
            <div className={style1.header}>
                <div className={style1.container}>
                    <div>
                        <h1 className={style1.h1}>Welcome to Your E-Commerce Store</h1>
                        <p className={style1.p}>Discover the latest trends and shop your favorite products today.</p>
                        <div className={style1.buttons}>
                            <Link to="/login" className={style1.loginbutton}>Login</Link>
                            <Link to="/signup" className={style1.signupbutton}>Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}