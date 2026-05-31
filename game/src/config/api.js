import axios from "axios";

const api = axios.create({
    baseURL: `https://api.rawg.io/api`,
    timeout: 10000,
     params: {
        key: import.meta.env.VITE_RAWG_API_KEY,
      },
});

export default api;
