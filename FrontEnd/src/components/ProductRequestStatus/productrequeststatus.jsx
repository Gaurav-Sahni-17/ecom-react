import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./productrequeststatus.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import swal from "sweetalert2"
import Logout from "../../controllers/logout/logout.js"
export default function ProductRequestStatus() {
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [pendingProducts, setpendingProducts] = useState([]);
    const [rejectedProducts, setrejectedProducts] = useState([]);
    const navigate = useNavigate();
    const handleOpen = () => {
        setOpen(!open);
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/login");
        }
        else {
            const t = token.split(":");
            if (t[1] !== "seller") {
                navigate("/access");
            }
            else {
                fetch("http://localhost:3000/checkuser", {
                    headers: {
                        token: t[0],
                    }
                }).then((res) => {
                    if (res.status === 401) {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }
                    return res.json();
                }).then((data) => {
                    console.log(data);
                    setUser({ ...data });
                }).catch((err) => {
                    navigate("/login");
                })
            }
        }
    }, [])
    useEffect(() => {
        if (user.username) {
            fetch("http://localhost:3000/pendingproductsofseller", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ id: user.id })
            })
                .then((res) => {
                    return res.json();
                }).then((data) => {
                    console.log(data);
                    setpendingProducts([...data]);
                })
        }
    }, [user.username])
    useEffect(() => {
        if (user.username) {
            fetch("http://localhost:3000/rejectedproductsofseller", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ id: user.id })
            })
                .then((res) => {
                    return res.json();
                }).then((data) => {
                    console.log(data);
                    setrejectedProducts([...data]);
                })
        }
    }, [user.username])
    function logoutUser() {
        Logout().then(() => {
            navigate("/");
        }).catch(() => {
            swal.fire({
                icon: "error",
                title: "Failed to logout"
            })
        })
    }
    function changePassword() {
        navigate("/changepass");
    }
    function goback() {
        navigate("/seller");
    }
    return (
        <>
            <div className={styles.head}>
                <h1 className={styles.heading}>Welcome {user.username}</h1>
                <div className={styles.dropdown}>
                    <button onClick={handleOpen} className={styles.dropbtn}>
                        <AiOutlineMenu />
                    </button>
                    {open ? (
                        <div className={styles.dropdown_content}>
                            <li onClick={logoutUser}>Logout</li>
                            <li onClick={changePassword}>Change Password</li>
                            <li onClick={goback}>Go Back</li>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <h2 className={styles.form_head}>Products Requests</h2>
            <table className={styles.back}>
                <caption className={styles.caption} >Pending Requests</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Seller ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Image</th>
                    <th className={`${styles.cell} ${styles.height}`}>Quantity</th>
                    <th className={`${styles.cell} ${styles.height}`}>Price</th>
                </tr>
                {
                    pendingProducts.length > 0 ?
                        pendingProducts.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.id}</td>
                                    <td className={styles.cell}>{element.seller_id}</td>
                                    <td className={styles.cell}>{element.name}</td>
                                    <td className={styles.cell}><img src={"http://localhost:3000/" + element.image} /></td>
                                    <td className={styles.cell}>{element.quantity}</td>
                                    <td className={styles.cell}>{"Rs."+element.price}</td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Product Requests Found</tr>
                }
            </table>
            <table className={styles.back2}>
                <caption className={styles.caption} >Rejected Requests</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Seller ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Image</th>
                    <th className={`${styles.cell} ${styles.height}`}>Quantity</th>
                    <th className={`${styles.cell} ${styles.height}`}>Price</th>
                </tr>
                {
                    rejectedProducts.length > 0 ?
                        rejectedProducts.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.id}</td>
                                    <td className={styles.cell}>{element.seller_id}</td>
                                    <td className={styles.cell}>{element.name}</td>
                                    <td className={styles.cell}><img src={"http://localhost:3000/" + element.image} /></td>
                                    <td className={styles.cell}>{element.quantity}</td>
                                    <td className={styles.cell}>{"Rs."+element.price}</td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Products Found</tr>
                }
            </table>
        </>
    )
}