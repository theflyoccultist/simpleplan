import express, { Router, Request, Response } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { Event } from '../models/Event';
import { body, validationResult } from 'express-validator';

const router = Router();

// GET all /events
router.get('/', authenticateToken, async (req, res) => {

    try {
        const events = await Event.findAll()

        if (!events.length) {
            return res.status(404).json({ message: 'No events found' });
        }

        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'})
    }
});

// POST /events
router.post('/', authenticateToken, 
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('eventDate').isISO8601().withMessage('Event Date must be a valid date'),
        body('eventTime').notEmpty().withMessage('Event Time is required'),   
    ],    
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
    const { name, eventDate, eventTime, location, description } = req.body;
    
    try {
        const event = await Event.create({
            name,
            eventDate,
            eventTime,
            location,
            description,
        });
        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'})
    }
});

// PUT /events/:eventId
router.put('/:eventId', authenticateToken, 
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('eventDate').isISO8601().withMessage('Event Date must be a valid date'),
        body('eventTime').notEmpty().withMessage('Event Time is required'),   
    ],
    async (req: Request, res: Response) => {
        const { eventId } = req.params;
        const { name, eventDate, eventTime, location, description } = req.body;
        try {
            const event = await Event.findByPk(eventId);
            if (!event) {
                return res.status(404).json({ message: 'Event not found'})
            }

            event.name = name;
            event.eventDate = eventDate;
            event.eventTime = eventTime;
            event.location = location;
            event.description = description;

            await event.save();
            res.status(200).json(event);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' })
        }
    });

// DELETE /events/:eventId
router.delete('/:eventId', authenticateToken, async (req: Request, res: Response) => {
    const { eventId } = req.params;

    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

export default router;