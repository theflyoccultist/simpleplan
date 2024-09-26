import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCreateForm from './EventCreateForm';
import EventEdit from './EventEdit';
import { Button } from 'react-bootstrap';

interface Event {
    id: number;
    name: string;
    eventDate: string;
    eventTime: string;
    location: string;
    description: string;
}

const EventsList: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<'name' | 'eventDate'>('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);


    useEffect(() => {
        // Fetch events from the backend
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

    const deleteEvent = async (eventId: number) => {
        try {
            await axios.delete(`http://localhost:3000/events/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        } catch (error) {
            console.error('Error deleting event', error);
        }
    };

    // Filter events based on search query
    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort events by selected field and order
    const sortedEvents = filteredEvents.sort((a, b) => {
        let fieldA: string | number;
        let fieldB: string | number;

        // Handle date Comparaison
        if (sortField === 'eventDate') {
            fieldA = new Date(a.eventDate).getTime();
            fieldB = new Date(b.eventDate).getTime();
        } else {
            // Handle string or other types
            fieldA = a[sortField]
            fieldB = b[sortField]
        }

        if (sortOrder === 'asc') {
            return fieldA > fieldB ? 1 : -1;
        } else {
            return fieldA < fieldB ? 1 : -1;
        }
    });

    const handleEditClick = (event: Event) => {
        setSelectedEvent(event);
        setShowEditModal(true);
    }

    return (
        <div>
            <EventCreateForm />
            <h2>Events List</h2>
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Sort Options */}
            <select onChange={(e) => setSortField(e.target.value as 'name' | 'eventDate')}>
                <option value="name">Sort by Name</option>
                <option value="eventDate">Sort by Date</option>
            </select>
            <select onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>

            {/* Events List */}
            <ul>
                {sortedEvents.map(event => (
                    <li key={event.id}>
                        <h3>{event.name}</h3>
                        <p>Date: {event.eventDate}</p>
                        <p>Time: {event.eventTime}</p>
                        <p>Location: {event.location}</p>
                        <p>Description: {event.description}</p>
                        <Button onClick={() => handleEditClick(event)}>Edit Event</Button>
                        <Button variant='danger' onClick={() => deleteEvent(event.id)}>Delete Event</Button>
                    </li>
                ))}
            </ul>

            {selectedEvent && (
                <EventEdit 
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    event={selectedEvent}
                    setEvents={setEvents}
                />
            )}
        </div>
    );
};

export default EventsList;
