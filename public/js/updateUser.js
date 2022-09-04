import axios from 'axios';
import { hideAlert, showAlert } from './alerts'

export const updateData = async (name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:3000/api/v1/users/updateMe',
            data: { name, email }
        });
        if (res.data.status === 'success')
            showAlert('success', 'Settings were updated!');
        window.setTimeout(() => {
            hideAlert();
            location.reload(true);
        }, 1000);
    } catch (err) {
        showAlert('error', err.response.data.message);
        window.setTimeout(hideAlert, 2000);
    }
}  