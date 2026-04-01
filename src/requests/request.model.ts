import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

export interface RequestAttributes {
    id: number;
    type: string;
    items: string;
    status: string;
    employeeEmail: string;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RequestCreationAttributes
    extends Optional<RequestAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Request
    extends Model<RequestAttributes, RequestCreationAttributes>
    implements RequestAttributes {
    public id!: number;
    public type!: string;
    public items!: string;
    public status!: string;
    public employeeEmail!: string;
    public date!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Request {
    Request.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            type: { type: DataTypes.STRING, allowNull: false },
            items: { type: DataTypes.TEXT, allowNull: false },
            status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Pending' },
            employeeEmail: { type: DataTypes.STRING, allowNull: false },
            date: { type: DataTypes.STRING, allowNull: false },
            createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
            updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
        },
        {
            sequelize,
            modelName: 'Request',
            tableName: 'requests',
            timestamps: true
        }
    );
    return Request;
}