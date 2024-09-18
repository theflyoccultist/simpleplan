import express, { Express, Request, Response } from "express";
import { sequelize } from "./config/database";
import dotenv from "dotenv"
import authRouter from './routes/auth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Sequelize models synced successfully');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err)
    })

app.use('/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('API Running');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});