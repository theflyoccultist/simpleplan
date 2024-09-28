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

    useEffect(() => {
        if (selectedEvent) {
            const fetchTickets = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/events/${selectedEvent.id}/tickets`, {
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
        }
    }, [selectedEvent]);

    // Function to handle event selection
    const handleSelectEvent = (event: Event) => {
        setSelectedEvent(event);
        setTickets([]);
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

        {/* Display selected event name and ticket creation form */}
        {selectedEvent && (
            <>
                <h2>Creating Tickets for: {selectedEvent.name}</h2>
                <TicketCreateForm eventId={selectedEvent.id}/>
            </>
        )}

        {/* Display tickets for a selected event */}
        {selectedEvent && tickets.length > 0 && (
            <>
                <h2>Displaying Tickets for: {selectedEvent.name}</h2>
                <ul>
                    {tickets.map(ticket => (
                        <li key={ticket.id}>
                            <p>Name: {ticket.name}</p>
                            <p>Price: {ticket.price}</p>
                            <p>Category: {ticket.category}</p>
                            <p>Availability: {ticket.availability ? 'Available': 'Not Available'}</p>
                        </li>                
                     ))}
                </ul>      
            </>
        )}

        {/* Message if no tickets are found */}
        {selectedEvent && tickets.length === 0 && (
            <p>No tickets available for the selected event.</p>
        )}
    </div>
    );
};

export default TicketList;