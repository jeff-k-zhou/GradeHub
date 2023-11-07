import axios from "axios"

const client = axios.create({
    baseURL: "https://gradehubserver.onrender.com",
})

export default client