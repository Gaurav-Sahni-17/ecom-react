export default function signupseller(data) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/sellersignup", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => {
            if (res.status === 200) {
                resolve();
                return;
            }
            else {
                reject("Email Already Exists");
                return;
            }
        }).catch((err) => {
            reject("Something Went Wrong");
            return;
        })
    })
}