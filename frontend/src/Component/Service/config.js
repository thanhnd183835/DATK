import axios from 'axios';
import { BASE_URL } from '../ultils/constants';

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}`,
    timeout: 20000,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
});

export default axiosInstance;
