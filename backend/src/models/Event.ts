import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

interface EventAttributes {
    id?: number;
    name: string;
    eventDate: Date;
    eventTime: string;
    location: string;
    description: string;
}

class Event extends Model<EventAttributes> implements EventAttributes {
    public id!: number;
    public name!: string;
    public eventDate!: Date;
    public eventTime!: string;
    public location!: string;
    public description!: string;
}

Event.init(
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
        eventDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        eventTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'events',
    }
);

export { Event }