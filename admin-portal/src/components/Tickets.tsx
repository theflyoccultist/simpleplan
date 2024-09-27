import React, { useState, useEffect } from 'react';
import axios from "axios";

interface Ticket {
    id?: number;
    name: string;
    price: number;
    category: string;
    availability: boolean;
    eventId?: number;    
}

const TicketList: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    
    useEffect(() => {
        const fetchTickets = async (eventId: number) => {
            try {
                const response = await axios.get(`http://localhost:3000/tickets/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        }
                });
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets', error)   
            }
        };
        fetchTickets(1);
    }, []);

return (
    <div>
        <h2>Tickets</h2>
        <ul>
            <li>
                <p>Event Id:</p>
                <p>Name:</p>
                <p>Price:</p>
                <p>Category:</p>
                <p>Availability:</p>
            </li>
        </ul>
    </div>
)
};

export default TicketList;