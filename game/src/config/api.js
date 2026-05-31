import axios from "axios";

const api = axios.create({
    baseURL: "https://api.rawg.io/api",
    timeout: 10000,  
    params: {
        key: 'c8739804d4964c4d9cdc1ea32a0ea53',
    },
});

export default api;
