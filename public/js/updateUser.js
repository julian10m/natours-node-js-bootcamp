import axios from 'axios';
import { hideAlert, showAlert } from './alerts'

export const updateSettings = async (data, type) => {
    try {
        const endpoint = type === 'data' ? 'updateMe' : 'updatePassword';
        const url = process.env.NODE_ENV === 'production' ?
            `/api/v1/users/${endpoint}` :
            `http://localhost:3000/api/v1/users/${endpoint}`;
        // console.log(url);
        const res = await axios({
            method: 'PATCH', url, data
        });
        if (res.data.status === 'success')
            showAlert('success', `${type.toUpperCase()} updated succesfully!`);
        window.setTimeout(() => {
            hideAlert();
            location.reload(true);
        }, 1000);
    } catch (err) {
        showAlert('error', err.response.data.message);
        window.setTimeout(hideAlert, 2000);
    }
}  