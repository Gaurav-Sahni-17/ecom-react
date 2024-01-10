import styles from "./seller.module.css"
import updateproduct from "../../controllers/product/updateproduct"
import swal from "sweetalert2"
import deleteproduct from "../../controllers/product/deleteproduct"
export default function Create({ data, deletefun, updatefun }) {
    const update = () => {
        updateproduct(data).then(() => {
            swal.fire({
                title: "Item updated Successfully",
                icon: "success"
            })
        }).catch((data) => {
            swal.fire({
                title: data,
                icon: "warning"
            })
        })
    }
    function changeData(val) {
        return function (e) {
            data[val] = e.target.value;
            updatefun({ key: val, value: e.target.value, id: data.id });
        }
    }
    const deleteProduct = () => {
        deletefun(data.id);
        deleteproduct(data).then(() => {
            swal.fire({
                title: "Item deleted Successfully",
                icon: "success"
            })
        }).catch((data) => {
            swal.fire({
                title: data,
                icon: "warning"
            })
        })
    }
    return (
        <>
            <div>
                <div>
                    <img src={"http://localhost:3000/" + data.image} className={styles.productimage} />
                </div>
                <div className={styles.form2}>
                    <label>Name: </label>
                    <input type="text" value={data.name} onChange={changeData("name")}></input>
                    <label>Description: </label>
                    <input type="text" value={data.description} onChange={changeData("description")}></input>
                    <label>Quantity: </label>
                    <input type="number" value={data.quantity} onChange={changeData("quantity")}></input>
                    <label>Price: </label>
                    <input type="number" value={data.price} onChange={changeData("price")}></input>
                </div>
                <div className={styles.button_container}>
                    <button onClick={update}>Update</button>
                    <button onClick={deleteProduct}>Delete</button>
                </div>
            </div>
        </>
    )
}
