import axios from "axios"

const client = axios.create({
    baseURL: "https://gradehubfisd-8c535c1aeeab.herokuapp.com/",
})

export default client