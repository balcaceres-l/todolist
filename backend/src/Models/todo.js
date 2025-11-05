// backend/src/Models/todo.js
import sequelize from '../Config/db.js';
import { DataTypes } from 'sequelize';
const Todo= sequelize.define('Todo', {
  id: {
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en progreso', 'completado'),
    defaultValue: 'pendiente'
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'todos',
  timestamps: false
});
export default Todo;
