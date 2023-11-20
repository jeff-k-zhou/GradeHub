import axios from "axios"

const client = axios.create({
    baseURL: "https://gradehubserver.vercel.app/",
})

export default client