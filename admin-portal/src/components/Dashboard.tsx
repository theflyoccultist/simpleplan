import { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import axios from "axios";
import '../styles/Dashboard.css'

export default function Dashboard () {
    const [events, setEvents] = useState<{ name: string}[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/events', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }  
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching event', error);
            }
        };
        fetchData();
    }, []);
    
    return (
        <Container>
            <div>
                <h2>Dashboard</h2>
            </div>
            <div>
                <Card className="dashboard-card">
                    <Card.Body>
                        <Card.Title>Events</Card.Title>
                            Total Events: {events.length}<br/>
                                {events.map((event, index) => (
                                <p key={index}>{event.name}</p>
                                ))}
                        <Card.Link href="/events">Manage events</Card.Link>
                    </Card.Body>
                </Card>
                <Card className="dashboard-card">
                    <Card.Body>
                        <Card.Title>Tickets</Card.Title>
                        <Card.Text>
                            Hello
                        </Card.Text>
                        <Card.Link href="/tickets">Manage tickets</Card.Link>
                    </Card.Body>
                </Card>            
            </div>            
        </Container>
    )
}