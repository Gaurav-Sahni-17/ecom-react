import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./manageproduct.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import swal from "sweetalert2"
import Logout from "../../controllers/logout/logout.js"
import acceptproduct from "../../controllers/product/acceptproduct.js";
import rejectproduct from "../../controllers/product/rejectproduct.js";
export default function ManageProduct() {
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [productDetails, setproductDetails] = useState([]);
    const [productRequests, setproductRequests] = useState([]);
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
        fetch("http://localhost:3000/getapprovedproducts")
            .then((res) => {
                return res.json();
            }).then((data) => {
                setproductDetails([...data]);
            })
    }, [user.username])
    useEffect(() => {
        fetch("http://localhost:3000/getproductrequests")
            .then((res) => {
                return res.json();
            }).then((data) => {
                setproductRequests([...data]);
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
    function accept(data) {
        return function (e) {
            acceptproduct(data).then(() => {
                swal.fire({
                    icon: "success",
                    title: "Product Accepted Successfully"
                }).then(() => {
                    setproductRequests(productRequests.filter((element) => {
                        return element.id != data.id;
                    }))
                    setproductDetails([...productDetails, data]);
                })
            }).catch((err) => {
                swal.fire({
                    title: err,
                    icon: "error"
                })
            })
        }
    }
    function reject(id) {
        return function (e) {
            rejectproduct({ id: id }).then(() => {
                swal.fire({
                    icon: "success",
                    title: "Product Rejected Successfully"
                }).then(() => {
                    setproductRequests(productRequests.filter((element) => {
                        return element.id != id;
                    }))
                })
            }).catch((err) => {
                swal.fire({
                    icon: "error",
                    title: err
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
                            <li onClick={goback}>Go Back</li>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <h2 className={styles.form_head}>Manage Products</h2>
            <table className={styles.back}>
                <caption className={styles.caption} >Product Requests</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Seller ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Image</th>
                    <th className={`${styles.cell} ${styles.height}`}>Quantity</th>
                    <th className={`${styles.cell} ${styles.height}`}>Price</th>
                    <th className={`${styles.cell} ${styles.height}`}>Action</th>
                </tr>
                {
                    productRequests.length > 0 ?
                        productRequests.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.id}</td>
                                    <td className={styles.cell}>{element.seller_id}</td>
                                    <td className={styles.cell}>{element.name}</td>
                                    <td className={styles.cell}><img src={"http://localhost:3000/" + element.image} /></td>
                                    <td className={styles.cell}>{element.quantity}</td>
                                    <td className={styles.cell}>{"Rs." + element.price}</td>
                                    <td className={styles.cell}><div className={styles.buttonpart}><button onClick={accept(element)}>Accept</button> <button onClick={reject(element.id)}>Reject</button></div></td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Product Requests Found</tr>
                }
            </table>
            <table className={styles.back2}>
                <caption className={styles.caption} >Present Users</caption>
                <tr className={`${styles.cell} ${styles.height}`}>
                    <th className={`${styles.cell} ${styles.height}`}>ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Seller ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Image</th>
                    <th className={`${styles.cell} ${styles.height}`}>Quantity</th>
                    <th className={`${styles.cell} ${styles.height}`}>Price</th>
                </tr>
                {
                    productDetails.length > 0 ?
                        productDetails.map((element) => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{element.id}</td>
                                    <td className={styles.cell}>{element.seller_id}</td>
                                    <td className={styles.cell}>{element.name}</td>
                                    <td className={styles.cell}><img src={"http://localhost:3000/" + element.image} /></td>
                                    <td className={styles.cell}>{element.quantity}</td>
                                    <td className={styles.cell}>{"Rs." + element.price}</td>
                                </tr>
                            )
                        }) :
                        <tr className={styles.cell} style={{ "color": "red", "font-size": "1.5rem" }}>No Products Found</tr>
                }
            </table>
        </>
    )
}