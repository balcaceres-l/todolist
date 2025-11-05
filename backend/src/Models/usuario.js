// backend/src/Models/usuario.js
import sequelize from '../Config/db.js';
import { DataTypes } from 'sequelize';
const Usuario = sequelize.define('Usuario', {
  id: {
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'usuarios',
  timestamps: false
});
export default Usuario;