import { Link } from "react-router-dom"
import styles from './access.module.css'
export default function Access() {
    return (
        <>
            <div className={styles.body}>
                <div className={styles.outer}>
                    <div className={styles.container}>
                        <h1 className={styles.h1}>No access</h1>
                        <p className={styles.p}>You don't have access to this page.</p>
                        <Link to="/"><button className={styles.button}>Home</button></Link>
                    </div>
                </div>
            </div>
        </>
    )
}