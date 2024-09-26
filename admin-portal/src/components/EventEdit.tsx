import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap'
import axios from 'axios';

interface EventEditProps {
    show: boolean;
    handleClose: () => void;
    event: {
        id: number;
        name: string;
        eventDate: string;
        eventTime: string;
        location: string;
        description: string;
    };
    setEvents: React.Dispatch<React.SetStateAction<any[]>>;
}

const EventEdit: React.FC<EventEditProps> = ({ show, handleClose, event, setEvents }) => {
    const [name, setName] = useState(event.name);
    const [eventDate, setEventDate] = useState(event.eventDate);
    const [eventTime, setEventTime] = useState(event.eventTime);
    const [location, setLocation] = useState(event.location);
    const [description, setDescription] = useState(event.description);

    useEffect(() => {
        setName(event.name);
        setEventDate(event.eventDate);
        setEventTime(event.eventTime);
        setLocation(event.location);
        setDescription(event.description);
    }, [event]);

    const editEvent = async () => {
        try {
            const updatedEvent = { name, eventDate, eventTime, location, description}
            const response = await axios.put(`http://localhost:3000/events/${event.id}`, updatedEvent, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setEvents(prevEvents => prevEvents.map(e => 
                e.id === event.id ? response.data : e
            ));
            handleClose();
        } catch (error) {
            console.error('Error updating event', error);
        }
    }

    return (
        <div>
            
            <Modal
                show={show}
                onHide={handleClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3' controlId='eventName'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type='text'
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
                                type='text'
                                placeholder='Event Location'
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='eventDescription'>
                            <Form.Label>Event Description</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter Description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Cancel</Button>
                    <Button variant='primary' onClick={editEvent}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EventEdit;