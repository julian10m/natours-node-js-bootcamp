import axios from 'axios';
import { hideAlert, showAlert } from './alerts'

export const login = async (email, password) => {
    try {
        const url = process.env.NODE_ENV === 'production' ?
            '/api/v1/users/login' :
            'http://localhost:3000/api/v1/users/login';
        const res = await axios({
            method: 'POST',
            url,
            data: { email, password }
        });
        if (res.data.status === 'success')
            showAlert('success', 'Logged in successfully!');
        window.setTimeout(() => {
            hideAlert();
            location.assign('/');
        }, 1000);
    } catch (err) {
        showAlert('error', err.response.data.message);
        window.setTimeout(hideAlert, 2000);
    }
}

export const logout = async () => {
    try {
        const url = process.env.NODE_ENV === 'production' ?
            '/api/v1/users/logout' :
            'http://localhost:3000/api/v1/users/logout';
        const res = await axios({
            method: 'GET',
            url,
        });
        // console.log(res);
        if (res.data.status === 'success') {
            // console.log('location to be reloaded');
            location.reload(true);
        }
    } catch (err) {
        showAlert('error', err);
        window.setTimeout(hideAlert, 2000);
    }
}