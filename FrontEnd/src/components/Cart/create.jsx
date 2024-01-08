import styles from "./cart.module.css"
import swal from "sweetalert2"
import removeFromCart from "../../controllers/cart/removefromcart"
import increaseCart from "../../controllers/cart/increasecartquantity"
import decreaseCart from "../../controllers/cart/decreasecartquantity"
export default function Create({ data, removeItem, increase, decrease }) {
    const showDesc = () => {
        swal.fire({
            title: "Description",
            text: data.description
        })
    }
    let remove = () => {
        let token = localStorage.getItem("token").split(":")[0];
        removeFromCart(data.id, token)
            .then(() => {
                swal.fire({
                    title: "Item Removed Successfully",
                    icon: "success"
                })
            }).catch((err) => {
                swal.fire({
                    title: err,
                    icon: "error"
                })
            })
        removeItem(data.id);
    }
    function decreaseQuantity() {
        if (data.quantity === 1) {
            swal.fire({
                title: "Minimum quantity reached",
                icon: "warning"
            })
        }
        else {
            let token = localStorage.getItem("token").split(":")[0];
            decreaseCart(data.id, token)
                .then(() => {
                    decrease(data.id);
                }).catch((err) => {
                    swal.fire({
                        title: err,
                        icon: "error"
                    })
                })
        }
    }
    function increaseQuantity() {
        if (data.quantity === data.stock) {
            swal.fire({
                title: "Maximum quantity reached",
                icon: "warning"
            })
        }
        else {
            let token = localStorage.getItem("token").split(":")[0];
            increaseCart(data.id, token)
                .then(() => {
                    increase(data.id);
                }).catch((err) => {
                    swal.fire({
                        title: err,
                        icon: "error"
                    })
                })
        }
    }
    return (
        <>
            <div>
                <div>
                    <img src={"http://localhost:3000/" + data.image} className={styles.productimage} />
                </div>
                <div>
                    <div className={styles.cardelement}>
                        <p>Name: </p>
                        <p>{data.name}</p>
                    </div>
                    <div className={styles.cardelement}>
                        <p>Price: </p>
                        <p>{"Rs. " + data.price}</p>
                    </div>
                    <div className={styles.cardelement}>
                        {console.log(data.quantity,data.stock)}
                        {data.quantity <= data.stock ?
                            <>
                                <p>Quantity: </p>
                                <p>{data.quantity}</p>
                        <div className={styles.quantity_buttons}>
                            <button onClick={decreaseQuantity}>-</button>
                            <button onClick={increaseQuantity}>+</button>
                        </div>
                            </> :
                            <p style={{"color":"red"}}>Out of stock</p>
                        }
                    </div>
                </div>
                <div className={styles.button_container}>
                    <button onClick={showDesc}>View Desc.</button>
                    <button onClick={remove}>Remove from cart</button>
                </div>
            </div>
        </>
    )
}
