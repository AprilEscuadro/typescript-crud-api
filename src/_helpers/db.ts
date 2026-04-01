import config from '../../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';

export interface Database {
    User: any;
    Department: any;
    Employee: any;
    Request: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
    const { host, port, user, password, database } = config.database;

    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    const sequelize = new Sequelize(database, user, password, {
        host,
        dialect: 'mysql'
    });

    const { default: userModel } = await import('../users/user.model');
    const { default: departmentModel } = await import('../departments/department.model');
    const { default: employeeModel } = await import('../employees/employee.model');
    // @ts-ignore
    const { default: requestModel } = await import('../requests/request.model');

    db.User = userModel(sequelize);
    db.Department = departmentModel(sequelize);
    db.Employee = employeeModel(sequelize);
    db.Request = requestModel(sequelize);

    await sequelize.sync({ alter: true });

    console.log('✅ Database initialized and models synced');
}