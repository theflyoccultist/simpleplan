import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

interface TicketCreate {
    eventId: number;    
}

const TicketCreateForm: React.FC<TicketCreate> = ({ eventId }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [availability, setAvailability] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const MAX_QUANTITY = 50;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (quantity > MAX_QUANTITY) {
            alert(`Quantity should not exceed ${MAX_QUANTITY}`);
            return;
        }

        const ticketData = {
            name,
            price: parseFloat(price),
            category,
            availability,
            quantity
        };

        try {
            await axios.post(`http://localhost:3000/events/${eventId}/tickets`, ticketData, {
                    headers : {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Ticket created successfully');
        } catch (error) {
            console.error('error creating tickets', error);
        }
    }

return (
    <div>
        <h2>Create new tickets</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3' controlId='ticketName'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text' 
                        placeholder='Ticket name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='ticketPrice'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control 
                        type='number'
                        placeholder='Price'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='ticketCategory'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control 
                        type='text'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className='mb-3' controlId='ticketAvailability'>
                <Form.Check
                    type="checkbox"
                    label="Available?"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                />
                </Form.Group>
                <Form.Group className='mb-3' controlId='ticketQuantity'>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control 
                        type='number'
                        min='1'
                        max={MAX_QUANTITY}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                    />
                </Form.Group>

                <Button variant='primary' type='submit'>
                    Create Tickets
                </Button>
            </Form>
    </div>
)
}

export default TicketCreateForm;