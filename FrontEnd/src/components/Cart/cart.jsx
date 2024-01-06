import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Create from "./create.jsx"
import styles from "./cart.module.css"
import { AiOutlineMenu } from 'react-icons/ai';
import swal from "sweetalert2"
import Logout from "../../controllers/logout/logout.js"
import getcartproducts from "../../controllers/cart/getcartproducts.js";


export default function Product() {
    let noofproducts = 0, totalprice = 0;
    const [user, setUser] = useState({});
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
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
        getCartProducts();
    }, [user.username])
    function getCartProducts() {
        if (user.username) {

            getcartproducts(user.email)
                .then((data) => {
                    if (data == 201) {
                        swal.fire({
                            title: "Nothing in Cart",
                            icon: "info"
                        }).then(() => {
                            navigate("/product")
                        })
                    }
                    else {
                        setProducts([...data]);
                    }
                }).catch((err) => {
                    console.log(err);
                    swal.fire({
                        icon: "error",
                        title: err
                    })
                })
        }
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
    const remove = (childdata) => {
        setProducts(products.filter((data) => {
            return data.id != childdata;
        }))
    }
    const increase = (childdata) => {
        let arr = [];
        for (let i = 0; i < products.length; i++) {
            arr[i] = products[i];
            if (products[i].id == childdata) {
                arr[i].quantity++;
            }
        }
        setProducts(arr);
    }
    const decrease = (childdata) => {
        let arr = [];
        for (let i = 0; i < products.length; i++) {
            arr[i] = products[i];
            if (products[i].id == childdata) {
                arr[i].quantity--;
            }
        }
        setProducts(arr);
    }
    function changePassword() {
        navigate("/changepass");
    }
    function goBack() {
        navigate("/product");
    }
    function purchase() {
        swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor:"green",
            cancelButtonColor:"red",
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: "No, cancel it!",
        }).then(function (data) {
            if (data.isConfirmed) {
               navigate("/purchaseform");
            }
        })
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
                            <li onClick={goBack}>Go Back</li>
                            <li onClick={logoutUser}>Logout</li>
                            <li onClick={changePassword}>Change Password</li>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <h2 className={styles.form_head}>My Cart</h2>
            <div className={styles.productContainer}>
                {products.map((product) => {
                    noofproducts = noofproducts + product.quantity;
                    totalprice = totalprice + (product.quantity * product.price);
                    return <Create data={product} removeItem={remove} increase={increase} decrease={decrease} />
                })
                }
            </div>
            <div className={styles.billcontainer}>
                <h3>Total Bill</h3>
                <p>Number of products: {noofproducts}</p>
                <p>Total Price: {totalprice}</p>
            </div>
            <button className={styles.purchase} onClick={purchase}>Purchase Cart</button>
        </>
    )
}