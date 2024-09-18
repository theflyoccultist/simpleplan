import { Router } from 'express';
import { Ticket } from '../models/Ticket';
import { Event } from '../models/Event';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// GET tickets/:eventId
router.get('/:eventId', authenticateToken, async (req, res) => {
    const { eventId } = req.params;

    try {
        const tickets = await Ticket.findAll({
            where: { eventId },
            include: [{ model: Event, attributes: ['name', 'eventDate', 'eventTime'] }],
        });

        if (!tickets.length) {
            return res.status(404).json({ message: 'No tickets found for this event' });
        }

        res.status(200).json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST tickets/:eventId
router.post('/:eventId', authenticateToken, async (req, res) => {
    const { eventId } = req.params;
    const { name, price, category, availability } = req.body;

    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const ticket = await Ticket.create({
            name,
            price,
            category,
            availability,
            eventId: Number(eventId),
        });

        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT tickets/:ticketId
router.put('/:ticketId', authenticateToken, async (req, res) => {
    const { ticketId } = req.params;
    const { name, price, category, availability } = req.body;

    try {
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' })
        }

        ticket.name = name;
        ticket.price = price;
        ticket.category = category;
        ticket.availability = availability;

        await ticket.save();
        res.status(200).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' })
    }
});

// DELETE tickets/:ticketId
router.delete('/:ticketId', authenticateToken, async (req, res) => {
    const { ticketId } = req.params;

    try {
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        await ticket.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' })
    }
});

export default router;