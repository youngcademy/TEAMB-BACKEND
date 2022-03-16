import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({
    timestamps: false,
    tableName: 'users',
    charset: 'utf8',
    collate: 'utf8_general_ci',
})
export class User extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare userID: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare userPW: string;
}
