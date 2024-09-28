import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

interface LoginRequestBody {
    email: string;
    password: string;
}

const saltRounds = 12;

router.post('/register',
    [
        body('email').isEmail(),
        body('password').notEmpty(),
    ],
    async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;

        try {
            const existingUser = await User.findOne({ where: { email } });
            if(existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            bcrypt.hash(password, saltRounds, async (error, hash) => {
                if (error) {
                    return res.status(500).json({ message: 'error hashing password.'})
                }

                const newUser = await User.create({
                    email: email,
                    password: hash,
                });
            
                const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string, {
                    expiresIn: '1d',                
            });

            return res.status(201).json({ token });
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
)

router.post('/login', 
    [
        body('email').isEmail(),
        body('password').notEmpty(),
    ],
    async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({where: { email } });
            if(!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: 'Invalid password' })
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
                expiresIn: '1d',                
            });

            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

export default router;