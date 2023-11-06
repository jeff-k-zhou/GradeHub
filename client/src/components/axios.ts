import axios from "axios"

const client = axios.create({
    baseURL: "https://gradehubfisdserver.onrender.com/",
})

export default client