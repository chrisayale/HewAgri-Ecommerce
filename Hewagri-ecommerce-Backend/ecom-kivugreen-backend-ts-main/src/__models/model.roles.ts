import { DataTypes, Model } from 'sequelize'
import { connect } from '../__databases/connecte'
import { IRoles, IUsers } from '__enums/enum.interfacemodels';
import dotenv from 'dotenv';

dotenv.config()

const { APP_ESCAPESTRING } = process.env

export interface Role extends Model<IRoles>, IRoles { }

export const Roles = connect.define<Role>('__tbl_ecom_roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: APP_ESCAPESTRING
    }

}, { paranoid: true, timestamps: true });

// Roles.sync({ alter: true })
//     .then(() => {
//         console.log('=======> Cerated done `table Roles` ');
//     })
//     .catch((error) => {
//         console.error('Une erreur s\'est produite lors de la création de la table :', error);
//     });
