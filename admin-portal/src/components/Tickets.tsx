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
        fetchTickets();
    }, []);



};

export default TicketList;