import axios from "axios"

const client = axios.create({
    baseURL: "https://grade-hub.vercel.app",
})

export default client