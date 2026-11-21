import { Users } from './model.users';
import { Roles } from './model.roles';
import { Hasroles } from './model.hasroles';
import { Provinces } from './model.provinces';
import { Territoires } from './model.territoires';
import { Villages } from './model.villages';
import { Banks } from './model.banks';
import { Cooperatives } from './model.cooperatives';
import { Extras } from './model.extras';
import { Hasmembers } from './model.hasmembers';

// Définition unique des associations au démarrage de l'application
export function initAssociations() {
    // Users <-> Roles (Many-to-Many via Hasroles)
    Users.belongsToMany(Roles, {
        through: Hasroles,
        foreignKey: 'TblEcomUserId',
        otherKey: 'TblEcomRoleId'
    });
    Roles.belongsToMany(Users, {
        through: Hasroles,
        foreignKey: 'TblEcomRoleId',
        otherKey: 'TblEcomUserId'
    });

    // Users -> Provinces
    Users.belongsTo(Provinces, { foreignKey: 'idprovince', as: 'province' });
    Provinces.hasMany(Users, { foreignKey: 'idprovince' });

    // Users -> Territoires
    Users.belongsTo(Territoires, { foreignKey: 'idterritoire', as: 'territoire' });
    Territoires.hasMany(Users, { foreignKey: 'idterritoire' });

    // Users -> Villages
    Users.belongsTo(Villages, { foreignKey: 'idvillage', as: 'village' });
    Villages.hasMany(Users, { foreignKey: 'idvillage' });

    // Users -> Banks
    Users.hasOne(Banks, { foreignKey: 'id_responsable', as: 'bank' });
    Banks.belongsTo(Users, { foreignKey: 'id_responsable' });

    // Users -> Cooperatives (via id_responsable)
    Users.hasOne(Cooperatives, { foreignKey: 'id_responsable', as: 'cooperative' });
    Cooperatives.belongsTo(Users, { foreignKey: 'id_responsable' });

    // Users -> Extras
    Users.hasOne(Extras, { foreignKey: 'id_user', as: 'extra' });
    Extras.belongsTo(Users, { foreignKey: 'id_user' });

    // Users -> Hasmembers
    Users.hasMany(Hasmembers, { foreignKey: 'TblEcomUserId', as: 'memberships' });
    Hasmembers.belongsTo(Users, { foreignKey: 'TblEcomUserId' });

    console.log('✅ Associations initialized');
}