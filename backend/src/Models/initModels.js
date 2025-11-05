// backend/src/Models/initModels.js
import Usuario from './usuario.js';
import Todo from './todo.js';
import './asociaciones.js';

const initModels=()=>{
  return {
    Usuario,
    Todo
  }
};

export default initModels;