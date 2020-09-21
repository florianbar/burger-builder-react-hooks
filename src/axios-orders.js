import axios from 'axios';

const instance = axios.create({
    baseURL: "https://react-my-burger-e1e59.firebaseio.com/"
});

export default instance;