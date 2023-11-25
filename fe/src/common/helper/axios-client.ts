import axios from 'axios';

const endpoint = process.env.API_ENDPOINT ?? "http://localhost:3500";

const axiosClient = axios.create({
    baseURL: endpoint,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;