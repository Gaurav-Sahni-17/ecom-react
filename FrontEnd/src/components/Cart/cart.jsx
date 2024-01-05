import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect} from "react"
import Create from "./create.jsx"
import styles from "./cart.module.css"
import { AiOutlineMenu } from 'react-icons/ai'; 
import swal from "sweetalert2"
import Logout from "../../controllers/logout/logout.js"


export default function Product() {
    const [user, setUser] = useState({});
    const [products,setProducts]=useState([]);
    const [open, setOpen] = useState(false);
    const [flag,setFlag]=useState(true);
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
                    setUser({...data});
                }).catch((err) => {
                    navigate("/login");
                })
            }
        }
    }, [])  
    useEffect(()=>{
        getFiveProducts();
    },[user.username])
    function getFiveProducts(){
        if(user.username){
        fetch("http://localhost:3000/getcartproducts",{
            headers:{"content-type":"application/json"},
        })
        .then((res)=>{
             return res.json();
        }).then((data)=>{
            setProducts([...products,...data]);
        }).catch(()=>{
            swal.fire({
                icon:"error",
                title:"Failed to load products"
            })
        })
    }
    }
    function logoutUser(){
        Logout().then(()=>{
            navigate("/");
        }).catch(()=>{
            swal.fire({
                icon:"error",
                title:"Failed to logout"
            })
        })
    }
    function changePassword(){
        navigate("/changepass");
    }
    return(
        <>
        { flag ?
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
            <h2 className={styles.form_head}>My Cart</h2>
            <div className={styles.productContainer}>
                { products.map((product)=>{
                    return <Create data={product} />
                })
            }
            </div>
            </>
            : <div></div>}
            </>
    )
}