import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { AiOutlineMenu } from 'react-icons/ai'; 
import swal from "sweetalert2"
import styles from "./seller.module.css"
import Create from "./create.jsx"
import Logout from "../../controllers/logout/logout.js"
export default function Seller() {
    const [data, setData] = useState({ name: "", desc: "", quantity: "", price: "", file: null });
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
        fetch("http://localhost:3000/getallproductsofseller", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ id: user.id })
        }).then((res) => {
            return res.json();
        }).then((data) => {
            console.log(data);
            setProducts(data);
        })
    }, [user.username])
    function changeData(value) {
        return function (e) {
            if (value == "file") {
                setData({ ...data, [value]: e.target.files[0] });
            }
            else {
                setData({ ...data, [value]: e.target.value });
            }
        }
    }
    const AddProduct = () => {
        if (data.name.trim() === "" || data.price.trim() === "" || data.quantity.trim() === "" || data.desc.trim() === "" || data.file === null) {
            swal.fire({
                icon: "warning",
                title: "Please Fill all fields"
            })
        }
        else {
            let formdata = new FormData();
            formdata.append("name", data.name);
            formdata.append("price", data.price);
            formdata.append("desc", data.desc);
            formdata.append("quantity", data.quantity);
            formdata.append("file", data.file);
            formdata.append("user", JSON.stringify(user));
            fetch("http://localhost:3000/addproduct", {
                method: "POST",
                body: formdata,
            })
                .then((res) => {
                    if (res.status === 200) {
                        swal.fire({
                            icon: "success",
                            title: "Add request sent"
                        })

                    }
                    return res.json();
                }).then((data) => {
                    setData({ name: "", desc: "", quantity: "", price: "", file: null });
                })
        }
    }
    const deletefun = (childdata) => {
        setProducts(products.filter((data) => {
            return data.id != childdata;
        }))
    }
    const updatefun = (childdata) => {
        const { key, value, id } = childdata;
        let a = [];
        for (let i = 0; i < products.length; i++) {
            a[i] = products[i];
            if (products[i].id == id) {
                a[i][key] = value;
            }
        }
        setProducts(a);
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
    function productRequestStatus(){
        navigate("/productstatus");
    }
    function changePassword()
    {
        navigate("/changepass");
    }
    function manageOrders(){
        navigate("/sellerordermanagement")
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
              <li onClick={productRequestStatus}>Product Requests</li>
              <li onClick={manageOrders}>Manage Orders</li>
            </div>
          ) : (
            <div></div>
          )}
          </div>
            </div>
            <h2 className={styles.form_head}>Add products</h2>
            <div className={styles.form}>
                <label>Product Name: </label>
                <input type="text" placeholder="Enter product name" value={data.name} onChange={changeData("name")}></input>
                <label>Product Description: </label>
                <input type="text" placeholder="Enter product description" value={data.desc} onChange={changeData("desc")}></input>
                <label>Product Quantity: </label>
                <input type="number" placeholder="Enter product quantity" value={data.quantity} onChange={changeData("quantity")}></input>
                <label>Product Price: </label>
                <input type="number" placeholder="Enter product price" value={data.price} onChange={changeData("price")}></input>
                <label>Product Image: </label>
                <input type="file" accept="image/jpg" onChange={changeData("file")}></input><br></br>
            </div>
            <button className={styles.form_button} onClick={AddProduct}>Add Product</button>
            <h2 className={styles.form_head}>Available products</h2>
            <div className={styles.productContainer}>
                {products.map((product) => {
                    return <Create data={product} deletefun={deletefun} updatefun={updatefun} />
                })
                }
            </div>
        </>
    )
}
