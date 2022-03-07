import { Sequelize } from 'sequelize-typescript';

import { Dog } from './models';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '1234',
    database: 'sequelize',
    logging: false,
    models: [Dog],
});

export default sequelize;
