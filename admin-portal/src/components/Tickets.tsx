import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import axios from "axios";
import {QRCodeSVG} from 'qrcode.react';
import TicketCreateForm from './TicketCreateForm';
import '../styles/Tickets.css';

interface Ticket {
    id?: number;
    name: string;
    price: number;
    category: string;
    availability: boolean;
    eventId?: number;  
    quantity?: number;  
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
                    setTickets(mergeTickets(response.data));
                } catch (error) {
                    console.error('Error fetching tickets', error)   
                }
            };
            fetchTickets();            
        }
    }, [selectedEvent]);

    const mergeTickets = (tickets: Ticket[]): Ticket[] => {
        const merged: { [key: string]: Ticket } = {};

        tickets.forEach(ticket => {
            const key = `${ticket.name}_${ticket.price}_${ticket.category}_${ticket.availability}`;
        
            if (merged[key]) {
                merged[key].quantity = (merged[key].quantity || 1) +1;
            } else {
                merged[key] = { ...ticket, quantity: 1}
            }
        });

        return Object.values(merged);
    }

    // Function to handle event selection
    const handleSelectEvent = (event: Event) => {
        setSelectedEvent(event);
        setTickets([]);
    };

return (
    <div>
        <div className='event-selection'>
            <h3>Select an event to create tickets for:</h3>

                {events.map(event => (
                    <div key={event.id}>
                        <button onClick={() => handleSelectEvent(event)}>{event.name}</button>
                    </div>
                ))}
        
        </div>

        {/* Display selected event name and ticket creation form */}
        <div className='ticket-form'>
            {selectedEvent && (
                <>
                    <h2>Creating Tickets for: {selectedEvent.name}</h2>
                    <TicketCreateForm eventId={selectedEvent.id}/>
                </>
            )}
        </div>
        
        {/* Display tickets for a selected event */}
        {selectedEvent && tickets.length > 0 && (
            <>
                <h2>Displaying Tickets for: {selectedEvent.name}</h2>

                    {tickets.map((ticket, index) => (
                        <Card key={index} className='ticket-card'>
                            <Card.Body>
                                <p>Name: {ticket.name}</p>
                                <p>Price: {ticket.price}</p>
                                <p>Category: {ticket.category}</p>
                                <p>Availability: {ticket.availability ? 'Available': 'Not Available'}</p>
                                <p>Quantity: {ticket.quantity}</p>

                                {/* Display QR code for the first ticket / for all tickets if expanded */}
                                <QRCodeSVG value={`Ticket ID: ${ticket.id}, Name: ${ticket.name}, Event: ${selectedEvent.name}`} />                
                            </Card.Body>
                        </Card>
                     ))}
   
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