import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import styles from "./purchaseform.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import swal from "sweetalert2"
import purchaseCart from "../../controllers/cart/purchasecart";
export default function Purchaseform() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [data, setData] = useState({ firstname: "", lastname: "", pin: "", state: "", country: "", city: "", address: "" })
    const [open, setOpen] = useState(false);
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
    function changeData(value) {
        return function (e) {
            setData({ ...data, [value]: e.target.value });
        }
    }
    function purchase() {
        if (data.firstname.trim() == "" || data.lastname.trim() == "" || data.pin.trim() == "" || data.state.trim() == "" || data.country.trim() == "" || data.city.trim() == "" || data.address.trim() == "") {
            swal.fire({
                title: "Please fill all fields",
                icon: "error"
            })
        }
        else {
            swal.fire({
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "green",
                cancelButtonColor: "red",
                confirmButtonText: 'Yes, I am sure!',
                cancelButtonText: "No, cancel it!",
            }).then(function (result) {
                if (result.isConfirmed) {
                    let orderdata = {
                        firstname: data.firstname,
                        lastname: data.lastname,
                        pin: data.pin,
                        state: data.state,
                        country: data.country,
                        city: data.city,
                        address: data.address,
                        email: user.email,
                        username: user.username
                    }
                    purchaseCart(orderdata)
                        .then(() => {
                            swal.fire({
                                title: "Order placed successfully",
                                icon: "success"
                            }).then(() => {
                                navigate("/product");
                            })
                        })
                        .catch((err) => {
                            swal.fire({
                                title: err,
                                icon: "error"
                            })
                        })
                }
            })
        }
    }
    function changePassword() {
        navigate("/changepass");
    }
    function goBack() {
        navigate("/cart");
    }
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
    const handleOpen = () => {
        setOpen(!open);
    };
    return (
        <>
            {/* <h1 className={styles.h1}>Welcome to the portal</h1>
    <Link to="/"><button className={styles.home}>Home</button></Link> */}
            <div className={styles.head}>
                <h1 className={styles.heading}>Welcome {user.username}</h1>
                <div className={styles.dropdown}>
                    <button onClick={handleOpen} className={styles.dropbtn}>
                        <AiOutlineMenu />
                    </button>
                    {open ? (
                        <div className={styles.dropdown_content}>
                            <li onClick={goBack}>Go Back</li>
                            <li onClick={logoutUser}>Logout</li>
                            <li onClick={changePassword}>Change Password</li>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <div className={styles.outer}>
                <div className={styles.container}>
                    <h2>Purchase Form</h2>
                    <div className={styles.form}>
                        <div className={styles.formgroup}>
                            <label for="firstname">First Name</label>
                            <input type="text" id="firstname" value={data.firstname} onChange={changeData("firstname")} name="firstname" placeholder="Enter your firstname" />
                        </div>
                        <div className={styles.formgroup}>
                            <label for="lastname">Last Name</label>
                            <input type="text" id="lastname" value={data.lastname} onChange={changeData("lastname")} name="lastname" placeholder="Enter your lastname" />
                        </div>
                        <div className={styles.formgroup}>
                            <label for="email">Email</label>
                            <input type="email" id="email" value={user.email} name="email" />
                        </div>
                        <div className={styles.formgroup}>
                            <label for="addresss">Address</label>
                            <input type="text" id="address" name="address" value={data.address} onChange={changeData("address")} placeholder="Enter your address" />
                        </div>
                        <div className={styles.formgroup}>
                            <label for="pin">Pin Code</label>
                            <input type="number" id="pin" name="pin" value={data.pin} onChange={changeData("pin")} placeholder="Enter pin code" />
                        </div>
                        <div className={styles.formgroup}>
                            <label for="city">City</label>
                            <select onChange={changeData("city")}>
                                <option value="">---</option>
                                <option value="Ambala">Ambala</option>
                                <option value="Yamunanagar">Yamunanagar</option>
                            </select>
                        </div>
                        <div className={styles.formgroup}>
                            <label for="state">State</label>
                            <select onChange={changeData("state")}>
                                <option value="">---</option>
                                <option value="Haryana">Haryana</option>
                            </select>
                        </div>
                        <div className={styles.formgroup}>
                            <label for="country">Country</label>
                            <select onChange={changeData("country")}>
                                <option value="">---</option>
                                <option value="India">India</option>
                            </select>
                        </div>
                        <div className={styles.btncontainer}>
                            <button type="button" onClick={purchase}>Purchase</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}