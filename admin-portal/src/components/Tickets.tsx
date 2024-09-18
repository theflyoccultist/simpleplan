import axios from "axios";

axios.get('/tickets/:eventId', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
});