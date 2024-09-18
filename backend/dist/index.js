"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
database_1.sequelize.authenticate()
    .then(() => {
    console.log('Database connected...');
    return database_1.sequelize.sync();
})
    .then(() => {
    console.log('Sequelize models synced successfully');
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
});
app.use('/auth', auth_1.default);
app.get('/', (req, res) => {
    res.send('API Running');
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
