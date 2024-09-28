"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Event_1 = require("./Event");
class Ticket extends sequelize_1.Model {
}
exports.Ticket = Ticket;
Ticket.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    availability: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    eventId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: Event_1.Event,
            key: 'id',
        },
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: 'Ticket',
    tableName: 'tickets',
});
Event_1.Event.hasMany(Ticket, { foreignKey: 'eventId' });
Ticket.belongsTo(Event_1.Event, { foreignKey: 'eventId' });
