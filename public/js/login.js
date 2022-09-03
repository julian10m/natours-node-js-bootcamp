import axios from 'axios';
import { hideAlert, showAlert } from './alerts'

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
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
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout',
        });
        console.log(res);
        if (res.data.status === 'success') {
            console.log('location to be reloaded');
            location.assign('/');
        }
    } catch (err) {
        showAlert('error', err);
        window.setTimeout(hideAlert, 2000);
    }
}