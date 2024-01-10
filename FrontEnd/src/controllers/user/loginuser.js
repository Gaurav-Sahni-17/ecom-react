export default function loginuser(data) {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then((res) => {
            return res.json();
        }).then((data => {
            localStorage.setItem("token", data.token)
            if (data.status == 201) {
                resolve("seller");
            }
            else if (data.status == 202) {
                resolve("admin");
            }
            else if (data.status == 203) {
                resolve("state");
            }
            else if (data.status == 204) {
                resolve("city");
            }
            else if (data.status == 205) {
                resolve("user");
            }
            else if (data.status == 401) {
                resolve("mailverify");
            }
            else {
                reject("Invalid username and password");
                return;
            }
        })).catch((err) => {
            reject("Something Went Wrong");
            return;
        })
    })
}