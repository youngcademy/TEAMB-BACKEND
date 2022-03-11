import { Sequelize } from 'sequelize-typescript';

import { Dog } from './models';
import { Order } from './order';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'tjdn0956',
    database: 'sequelize',
    logging: false,
    models: [Dog, Order],
});

export default sequelize;
