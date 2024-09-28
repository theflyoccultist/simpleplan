import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Event } from "./Event";

interface TicketAttributes {
    id?: number;
    name: string;
    price: number;
    category: string;
    availability: boolean;
    eventId?: number;
}

class Ticket extends Model<TicketAttributes> implements TicketAttributes {
    public id!: number;
    public name!: string;
    public price!: number;
    public category!: string;
    public availability!: boolean;
    public eventId!: number;
}

Ticket.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        availability: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        eventId: {
            type: DataTypes.INTEGER,
            references: {
                model: Event,
                key: 'id',
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Ticket',
        tableName: 'tickets',
    }
);

Event.hasMany(Ticket, {foreignKey: 'eventId' });
Ticket.belongsTo(Event, { foreignKey: 'eventId'});

export { Ticket }