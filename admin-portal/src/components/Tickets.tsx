import React, { useState, useEffect } from 'react';
import axios from "axios";
import TicketCreateForm from './TicketCreateForm';

interface Ticket {
    id?: number;
    name: string;
    price: number;
    category: string;
    availability: boolean;
    eventId?: number;    
}

interface Event {
    id: number;
    name: string;
}

const TicketList: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/tickets/`, {
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

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3000/events', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events', error);
            }
        };
        fetchEvents();
    }, []);

    // Function to handle event selection (Optional)
    const handleSelectEvent = (event: Event) => {
        setSelectedEvent(event);
    };

return (
    <div>
        <div>
            <h3>Select an event to create tickets for:</h3>
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        <button onClick={() => handleSelectEvent(event)}>{event.name}</button>
                    </li>
                ))}
            </ul>            
        </div>

        {/* Display selected event name */}
        {selectedEvent && (
            <>
                <h2>Creating Tickets for: {selectedEvent.name}</h2>
                <TicketCreateForm eventId={selectedEvent.id}/>
            </>
        )}

        <h2>Tickets</h2>
        <ul>
            {tickets.map(ticket => (
            <li key={ticket.id}>
                <p>Event Id: {ticket.eventId}</p>
                <p>Name: {ticket.name}</p>
                <p>Price: {ticket.price}</p>
                <p>Category: {ticket.category}</p>
                <p>Availability: {ticket.availability ? 'Available': 'Not Available'}</p>
            </li>                
            ))}
        </ul>
    </div>
    );
};

export default TicketList;