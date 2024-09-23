import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios'

interface EventCreate {
    name: string;
    eventDate: string;
    eventTime: string;
    location: string;
    description: string;
}

const createEvent = async (newEvent: EventCreate) => {
    try {
        const response = await axios.post('http://localhost:3000/events', newEvent, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        console.log('Event created successfully', response.data);
    } catch (error) {
        console.error('Error creating event', error)
    }
}

const EventCreateForm: React.FC = () => {
    const [name, setName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newEvent = {
            name, eventDate, eventTime, location, description,
        };

        createEvent(newEvent);

        setName('');
        setEventDate('');
        setEventTime('');
        setLocation('');
        setDescription('');
    }

return (
    <div>
    <h2>Create New Event</h2>
        <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='eventName'>
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    placeholder='Event Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>
            <Form.Group className='mb-3' controlId='eventDate'>
                <Form.Label>Event Date</Form.Label>
                <Form.Control 
                    type='date'
                    value={eventDate} 
                    onChange={(e) => setEventDate(e.target.value)}
                />
            </Form.Group>
            <Form.Group className='mb-3' controlId='eventTime'>
                <Form.Label>Event Time</Form.Label>
                <Form.Control 
                    type='time'
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)} 
                />
            </Form.Group>
            <Form.Group className='mb-3' controlId='eventLocation'>
                <Form.Label>Event Location</Form.Label>
                <Form.Control 
                    placeholder='Event Location'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </Form.Group>
            <Form.Group className='mb-3' controlId='eventDate'>
                <Form.Label>Event Description</Form.Label>
                <Form.Control 
                    type='text' 
                    placeholder='Enter Description' 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}    
                />
            </Form.Group>

            <Button variant='primary' type='submit'>
                Create
            </Button>
        </Form>
    </div>
    );
};

export default EventCreateForm;
