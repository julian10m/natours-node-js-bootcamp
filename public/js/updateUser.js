import axios from 'axios';
import { hideAlert, showAlert } from './alerts'

export const updateSettings = async (data, type) => {
    try {
        const url = `http://localhost:3000/api/v1/users/${type === 'data' ? 'updateMe' : 'updatePassword'}`;
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