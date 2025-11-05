// backend/src/Models/asociaciones.js
import Usuario from './usuario.js';
import Todo from './todo.js';

Usuario.hasMany(Todo, { foreignKey: 'idUsuario', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Todo.belongsTo(Usuario, { foreignKey: 'idUsuario', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
