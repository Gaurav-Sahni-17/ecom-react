import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./manageorders.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import swal from "sweetalert2"
import Logout from "../../controllers/logout/logout.js"
export default function ManageOrders() {
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [orderDetails, setorderDetails] = useState([]);
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
            if (t[1] !== "admin") {
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
                    setUser({ ...data });
                }).catch((err) => {
                    navigate("/login");
                })
            }
        }
    }, [])
    useEffect(() => {
        fetch("http://localhost:3000/getallorders")
            .then((res) => {
                return res.json();
            }).then((data) => {
                setorderDetails([...data]);
            })
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
        navigate("/admin");
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
            <h2 className={styles.form_head}>Manage Orders</h2>
            <table className={styles.back}>
                <caption className={styles.caption} >Orders</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>Order ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Seller ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Email</th>
                    <th className={`${styles.cell} ${styles.height}`}>Quantity</th>
                    <th className={`${styles.cell} ${styles.height}`}>Status</th>
                </tr>
                {
                    orderDetails.length > 0 ?
                        orderDetails.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.order_id}</td>
                                    <td className={styles.cell}>{element.product_id}</td>
                                    <td className={styles.cell}>{element.seller_id}</td>
                                    <td className={styles.cell}>{element.productname}</td>
                                    <td className={styles.cell}>{element.email}</td>
                                    <td className={styles.cell}>{element.quantity}</td>
                                    <td className={styles.cell}>{element.status}</td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Orders Found</tr>
                }
            </table>
        </>
    )
}