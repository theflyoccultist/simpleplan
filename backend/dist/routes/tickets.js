"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Ticket_1 = require("../models/Ticket");
const Event_1 = require("../models/Event");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router({ mergeParams: true });
// GET /events/:eventId/tickets
router.get('/', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    try {
        const tickets = yield Ticket_1.Ticket.findAll({
            where: { eventId },
            include: [{ model: Event_1.Event, attributes: ['name', 'eventDate', 'eventTime'] }],
        });
        if (!tickets.length) {
            return res.status(404).json({ message: 'No tickets found for this event' });
        }
        res.status(200).json(tickets);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// POST /events/:eventId/tickets
router.post('/', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const { name, price, category, availability, quantity } = req.body;
    try {
        const event = yield Event_1.Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const tickets = [];
        for (let i = 0; i < quantity; i++) {
            const ticket = yield Ticket_1.Ticket.create({
                name,
                price,
                category,
                availability,
                eventId: Number(eventId),
            });
            tickets.push(ticket);
        }
        res.status(201).json({ message: `${quantity} tickets created successfully!`, tickets });
    }
    catch (error) {
        console.error('Error creating tickets', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// PUT /events/:eventId/tickets/:ticketId
router.put('/:ticketId', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    const { name, price, category, availability } = req.body;
    try {
        const ticket = yield Ticket_1.Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        ticket.name = name;
        ticket.price = price;
        ticket.category = category;
        ticket.availability = availability;
        yield ticket.save();
        res.status(200).json(ticket);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// DELETE /events/:eventId/tickets/:ticketId
router.delete('/:ticketId', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ticketId } = req.params;
    try {
        const ticket = yield Ticket_1.Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        yield ticket.destroy();
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
