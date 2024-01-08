import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./admin.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import swal from "sweetalert2"
import Logout from "../../controllers/logout/logout.js"
import acceptseller from "../../controllers/seller/acceptseller.js";
import rejectseller from "../../controllers/seller/rejectseller.js";
export default function Admin() {
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [userDetails, setuserDetails] = useState([]);
    const [sellerRequests, setSellerRequests] = useState([]);
    const [hasUsers,sethasUsers]=useState(true);
    const [hasSellers,sethasSellers]=useState(true);
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
        fetch("http://localhost:3000/getallusers")
            .then((res) => {
                return res.json();
            }).then((data) => {
                setuserDetails([...data]);
                if(data.length==0){
                    sethasUsers(false);
                }
            })
    }, [user.username])
    useEffect(() => {
        fetch("http://localhost:3000/getsellerrequests")
            .then((res) => {
                return res.json();
            }).then((data) => {
                setSellerRequests([...data]);
                console.log(data);
                if(data.length==0){
                    sethasSellers(false);
                }
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
    function accept(data) {
        return function (e) {
            acceptseller(data).then(() => {
                swal.fire({
                    icon: "success",
                    title: "Seller Accepted Successfully"
                }).then(() => {
                    setSellerRequests(sellerRequests.filter((element) => {
                        return element.id != data.id;
                    }))
                    let sellerdata = {
                        id: data.id,
                        username: data.username,
                        email: data.email,
                        role: "seller",
                        isverified:1
                    }
                    setuserDetails([...userDetails, sellerdata]);
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
            rejectseller({id:id}).then(() => {
                swal.fire({
                    icon: "success",
                    title: "Seller Rejected Successfully"
                }).then(() => {
                    setSellerRequests(sellerRequests.filter((element) => {
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
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <h2 className={styles.form_head}>Manage Users</h2>
            <table className={styles.back}>
                <caption className={styles.caption} >Seller Requests</caption>
                <tr className={`${styles.cell} ${styles.height}`}>

                    <th className={`${styles.cell} ${styles.height}`}>ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Email</th>
                    <th className={`${styles.cell} ${styles.height}`}>Aadhar Number</th>
                    <th className={`${styles.cell} ${styles.height}`}>GST Number</th>
                    <th className={`${styles.cell} ${styles.height}`}>Brand Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Action</th>
                </tr>
                {
                    hasSellers?
                    sellerRequests.map((element) => {
                        return (
                            <tr>
                                <td className={styles.cell}>{element.id}</td>
                                <td className={styles.cell}>{element.username}</td>
                                <td className={styles.cell}>{element.email}</td>
                                <td className={styles.cell}>{element.aadhar}</td>
                                <td className={styles.cell}>{element.gst}</td>
                                <td className={styles.cell}>{element.brand}</td>
                                <td className={styles.buttonpart}><button onClick={accept(element)}>Accept</button> <button onClick={reject(element.id)}>Reject</button></td>
                            </tr>
                        )
                    }):
                    <tr className={styles.cell} style={{"color":"red","font-size":"1.5rem"}}>No Seller Requests Found</tr>
                }
            </table>
            <table className={styles.back2}>
                <caption className={styles.caption} >Present Users</caption>
                <tr className={`${styles.cell} ${styles.height}`}>

                    <th className={`${styles.cell} ${styles.height}`}>ID</th>
                    <th className={`${styles.cell} ${styles.height}`}>Name</th>
                    <th className={`${styles.cell} ${styles.height}`}>Email</th>
                    <th className={`${styles.cell} ${styles.height}`}>Role</th>
                    <th className={`${styles.cell} ${styles.height}`}>Is Verified</th>
                </tr>
                {
                    hasUsers?
                    userDetails.map((element) => {
                        return (
                            <tr>
                                <td className={styles.cell}>{element.id}</td>
                                <td className={styles.cell}>{element.username}</td>
                                <td className={styles.cell}>{element.email}</td>
                                <td className={styles.cell}>{element.role}</td>
                                <td className={styles.cell}>{element.isverified}</td>
                            </tr>
                        )
                    }):
                    <tr className={styles.cell} style={{"color":"red","font-size":"1.5rem"}}>No Users Found</tr>
                }
            </table>
        </>
    )
}