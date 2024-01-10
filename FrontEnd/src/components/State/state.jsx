import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./state.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import swal from "sweetalert2"
import Logout from "../../controllers/logout/logout.js"
import dispatchByState from "../../controllers/ordermanagement/dispatchbystate.js";
import acceptOrder from "../../controllers/ordermanagement/acceptorder.js";
export default function State() {
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [dispatchedOrders, setdispatchedOrders] = useState([]);
    const [OrdersToDispatch, setOrdersToDispatch] = useState([]);
    const [upcomingOrders, setupcomingOrders] = useState([]);
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
            if (t[1] !== "state") {
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
            fetch("http://localhost:3000/dispatchordersofstate", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ id: user.id })
            })
                .then((res) => {
                    return res.json();
                }).then((data) => {
                    setOrdersToDispatch([...data]);
                })
        }
    }, [user.username])
    useEffect(() => {
        if (user.username) {
            fetch("http://localhost:3000/dispatchedorders", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ id: user.id })
            })
                .then((res) => {
                    return res.json();
                }).then((data) => {

                    setdispatchedOrders([...data]);
                })
        }
    }, [user.username])
    useEffect(() => {
        if (user.username) {
            fetch("http://localhost:3000/upcomingorders", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ id: user.id })
            })
                .then((res) => {
                    return res.json();
                }).then((data) => {

                    setupcomingOrders([...data]);
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
    function home() {
        navigate("/");
    }
    function dispatch(element) {
        return function () {
            dispatchByState({ id: element.order_id, dispatcher_id: user.id, city: element.city }).then(() => {
                swal.fire({
                    title: "Order Dispatched successfully",
                    icon: "success"
                }).then(() => {
                    setOrdersToDispatch(OrdersToDispatch.filter((data) => {
                        return data.order_id != element.order_id;
                    }))
                    setdispatchedOrders([...dispatchedOrders, element]);
                })
            }).catch((err) => {
                swal.fire({
                    title: err,
                    icon: "error"
                })
            })
        }
    }
    function accept(element) {
        return function () {
            acceptOrder({ id: element.order_id, status: "Arrived State Terminal" }).then(() => {
                swal.fire({
                    title: "Accepted Successfully",
                    icon: "success"
                }).then(() => {
                    setupcomingOrders(upcomingOrders.filter((data) => {
                        return element.order_id != data.order_id;
                    }))
                    setOrdersToDispatch([...OrdersToDispatch, element]);
                })
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
                            <li onClick={home}>Home</li>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <h2 className={styles.form_head}>Manage Orders</h2>
            <table className={styles.back}>
                <caption className={styles.caption}>Orders to be Dispatched</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>Order ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Seller ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Email</th>
                    <th className={`${styles.cell} ${styles.height}`}>Quantity</th>
                    <th className={`${styles.cell} ${styles.height}`}>City</th>
                    <th className={`${styles.cell} ${styles.height}`}>Action</th>
                </tr>
                {
                    OrdersToDispatch.length > 0 ?
                        OrdersToDispatch.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.order_id}</td>
                                    <td className={styles.cell}>{element.product_id}</td>
                                    <td className={styles.cell}>{element.seller_id}</td>
                                    <td className={styles.cell}>{element.productname}</td>
                                    <td className={styles.cell}>{element.email}</td>
                                    <td className={styles.cell}>{element.quantity}</td>
                                    <td className={styles.cell}>{element.city}</td>
                                    <td className={styles.cell}><button onClick={dispatch(element)}>Dispatch</button></td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Orders to Dispatch</tr>
                }
            </table>
            <table className={styles.back2}>
                <caption className={styles.caption}>Upcoming Orders</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>Order ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Seller ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Email</th>
                    <th className={`${styles.cell} ${styles.height}`}>Quantity</th>
                    <th className={`${styles.cell} ${styles.height}`}>City</th>
                    <th className={`${styles.cell} ${styles.height}`}>Action</th>
                </tr>
                {
                    upcomingOrders.length > 0 ?
                        upcomingOrders.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.order_id}</td>
                                    <td className={styles.cell}>{element.product_id}</td>
                                    <td className={styles.cell}>{element.seller_id}</td>
                                    <td className={styles.cell}>{element.productname}</td>
                                    <td className={styles.cell}>{element.email}</td>
                                    <td className={styles.cell}>{element.quantity}</td>
                                    <td className={styles.cell}>{element.city}</td>
                                    <td className={styles.cell}><button onClick={accept(element)}>Accept</button></td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Upcoming Orders</tr>
                }
            </table>
            <table className={styles.back2}>
                <caption className={styles.caption} >Dispatched Orders</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>Order ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Seller ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Product Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Email</th>
                    <th className={`${styles.cell} ${styles.height}`}>Quantity</th>
                    <th className={`${styles.cell} ${styles.height}`}>City</th>
                </tr>
                {
                    dispatchedOrders.length > 0 ?
                        dispatchedOrders.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.order_id}</td>
                                    <td className={styles.cell}>{element.product_id}</td>
                                    <td className={styles.cell}>{element.seller_id}</td>
                                    <td className={styles.cell}>{element.productname}</td>
                                    <td className={styles.cell}>{element.email}</td>
                                    <td className={styles.cell}>{element.quantity}</td>
                                    <td className={styles.cell}>{element.city}</td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Orders Dispatched</tr>
                }
            </table>
        </>
    )
}