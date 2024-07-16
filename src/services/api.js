import axios from "axios";

const apiEstudante = axios.create({
    baseURL : "http://localhost:5240",
})

export default apiEstudante;