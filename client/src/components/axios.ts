import axios from "axios"

const client = axios.create({
    baseURL: "https://unrivaled-genie-3b23d7.netlify.app/",
})

export default client