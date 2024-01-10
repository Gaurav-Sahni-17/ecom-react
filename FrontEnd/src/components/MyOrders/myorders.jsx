import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./myorders.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import swal from "sweetalert2"
import cancelOrder from "../../controllers/ordermanagement/cancelorder.js";
import Logout from "../../controllers/logout/logout.js"
export default function MyOrders() {
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [pendingOrders, setpendingOrders] = useState([]);
    const [deliveredOrders, setdeliveredOrders] = useState([]);
    const [cancelledOrders, setcancelledOrders] = useState([]);
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
            if (t[1] !== "user") {
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
        if (user.username) {
            fetch("http://localhost:3000/allordersofuser", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email: user.email })
            })
                .then((res) => {
                    return res.json();
                }).then((data) => {
                    setcancelledOrders(data.filter((element) => {
                        return element.status === "Cancelled";
                    }));
                    setdeliveredOrders(data.filter((element) => {
                        return element.status === "Delivered";
                    }))
                    setpendingOrders(data.filter((element) => {
                        return (element.status !== "Delivered" && element.status !== "Cancelled");
                    }))
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
        navigate("/product");
    }
    function cancel(element) {
        return function () {
            swal.fire({
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "red",
                confirmButtonText: 'Yes',
                cancelButtonText: "No",
            }).then(function (result) {
                if (result.isConfirmed) {
                    cancelOrder({ id: element.order_id, quantity: element.quantity, productid: element.product_id }).then(() => {
                        swal.fire({
                            title: "Order Cancelled successfully",
                            icon: "success"
                        }).then(() => {
                            setpendingOrders(pendingOrders.filter((data) => {
                                return element.order_id != data.order_id;
                            }))
                            setcancelledOrders([...cancelledOrders, element]);
                        })
                    }).catch((err) => {
                        swal.fire({
                            title: err,
                            icon: "error"
                        })
                    })
                }
            })
        }
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
            {/* <h2 className={styles.form_head}>My Orders</h2> */}
            <table className={styles.back}>
                <caption className={styles.caption}>My  Orders</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>Order ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Seller ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Email</th>
                    <th className={`${styles.cell} ${styles.height}`}>Quantity</th>
                    <th className={`${styles.cell} ${styles.height}`}>Order Date</th>
                    <th className={`${styles.cell} ${styles.height}`}>Status</th>
                    <th className={`${styles.cell} ${styles.height}`}>Action</th>
                </tr>
                {
                    pendingOrders.length > 0 ?
                        pendingOrders.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.order_id}</td>
                                    <td className={styles.cell}>{element.product_id}</td>
                                    <td className={styles.cell}>{element.seller_id}</td>
                                    <td className={styles.cell}>{element.productname}</td>
                                    <td className={styles.cell}>{element.email}</td>
                                    <td className={styles.cell}>{element.quantity}</td>
                                    <td className={styles.cell}>{element.date}</td>
                                    <td className={styles.cell}>{element.status}</td>
                                    <td className={styles.cell}><button onClick={cancel(element)}>Cancel</button></td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Orders to Show</tr>
                }
            </table>
            <table className={styles.back2}>
                <caption className={styles.caption} >Delivered Orders</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>Order ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Seller ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Email</th>
                    <th className={`${styles.cell} ${styles.height}`}>Quantity</th>
                    <th className={`${styles.cell} ${styles.height}`}>Order Date</th>
                </tr>
                {
                    deliveredOrders.length > 0 ?
                        deliveredOrders.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.order_id}</td>
                                    <td className={styles.cell}>{element.product_id}</td>
                                    <td className={styles.cell}>{element.seller_id}</td>
                                    <td className={styles.cell}>{element.productname}</td>
                                    <td className={styles.cell}>{element.email}</td>
                                    <td className={styles.cell}>{element.quantity}</td>
                                    <td className={styles.cell}>{element.date}</td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Orders Delivered yet</tr>
                }
            </table>
            <table className={styles.back2}>
                <caption className={styles.caption} >Cancelled Orders</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>Order ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Seller ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Email</th>
                    <th className={`${styles.cell} ${styles.height}`}>Quantity</th>
                    <th className={`${styles.cell} ${styles.height}`}>Order Date</th>
                </tr>
                {
                    cancelledOrders.length > 0 ?
                        cancelledOrders.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.order_id}</td>
                                    <td className={styles.cell}>{element.product_id}</td>
                                    <td className={styles.cell}>{element.seller_id}</td>
                                    <td className={styles.cell}>{element.productname}</td>
                                    <td className={styles.cell}>{element.email}</td>
                                    <td className={styles.cell}>{element.quantity}</td>
                                    <td className={styles.cell}>{element.date}</td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Orders Cancelled yet</tr>
                }
            </table>
        </>
    )
}