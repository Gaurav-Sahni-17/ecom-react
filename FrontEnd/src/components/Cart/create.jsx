import styles from "./cart.module.css"
import swal from "sweetalert2"
import addToCart from "../../controllers/cart/addtocart"
export default function Create({ data}) {
    const showDesc=()=>{
        swal.fire({
            title:"Description",
            text:data.description
        })
    }
    const add=()=>{
        let token=localStorage.getItem("token").split(":")[0];
        addToCart(data.id,token)
        .then(()=>{
            swal.fire({
                title:"Added to Cart",
                icon:"success"
            })
        }).catch((data)=>{
            swal.fire({
                title:data,
                icon:"warning"
            })
        })
    }
    return (
        <>
            <div>
                <div>
                    <img src={"http://localhost:3000/"+ data.image} className={styles.productimage} />
                </div>
                <div>
                    <div className={styles.cardelement}>
                    <p>Name: </p>
                    <p>{data.name}</p>
                    </div>
                    <div className={styles.cardelement}>
                    <p>Quantity: </p>
                    <p>{data.quantity}</p>
                    </div>
                    <div className={styles.cardelement}>
                    <p>Price: </p>
                    <p>{"Rs. "+data.price}</p>
                    </div>
                </div>
                <div className={styles.button_container}>
                    <button onClick={showDesc}>View Desc.</button>
                    <button onClick={add}>Add to cart</button>
                </div>
            </div>
        </>
    )
}
