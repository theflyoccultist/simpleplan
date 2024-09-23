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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const Event_1 = require("../models/Event");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// GET all /events
router.get('/', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield Event_1.Event.findAll();
        if (!events.length) {
            return res.status(404).json({ message: 'No events found' });
        }
        res.status(200).json(events);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// POST /events
router.post('/', authMiddleware_1.authenticateToken, [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('eventDate').isISO8601().withMessage('Event Date must be a valid date'),
    (0, express_validator_1.body)('eventTime').notEmpty().withMessage('Event Time is required'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, eventDate, eventTime, location, description } = req.body;
    try {
        const event = yield Event_1.Event.create({
            name,
            eventDate,
            eventTime,
            location,
            description,
        });
        res.status(201).json(event);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// PUT /events/:eventId
router.put('/:eventId', authMiddleware_1.authenticateToken, [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('eventDate').isISO8601().withMessage('Event Date must be a valid date'),
    (0, express_validator_1.body)('eventTime').notEmpty().withMessage('Event Time is required'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const { name, eventDate, eventTime, location, description } = req.body;
    try {
        const event = yield Event_1.Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        event.name = name;
        event.eventDate = eventDate;
        event.eventTime = eventTime;
        event.location = location;
        event.description = description;
        yield event.save();
        res.status(200).json(event);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}));
// DELETE /events/:eventId
router.delete('/:eventId', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    try {
        const event = yield Event_1.Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        yield event.destroy();
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
exports.default = router;
