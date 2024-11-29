import axios from "axios"

const apiClient = axios.create({
    baseURL: "http://"
})

export default apiClient