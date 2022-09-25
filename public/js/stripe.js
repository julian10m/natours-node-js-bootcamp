const stripe = Stripe('pk_test_51LgUBFAIEJWmY60rwlRbbZbfscrQym5O28XdQVUCH1ADG0nHsd6yAbKpizov65jWH30ekwb2ZkJ1EXU4QgoJp0AX007twj8beN');
import { hideAlert, showAlert } from './alerts'
import axios from 'axios';

export const bookTour = async tourId => {
    try {
        const url = process.env.NODE_ENV === 'production' ?
            `/api/v1/bookings/checkout-session/${tourId}` :
            `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`;
        const sessionResp = await axios(url);
        // console.log(sessionResp);
        await stripe.redirectToCheckout({
            sessionId: sessionResp.data.session.id
        })
    } catch (err) {
        console.log(err);
        showAlert('error', err);
        window.setTimeout(hideAlert, 2000);
    }
}