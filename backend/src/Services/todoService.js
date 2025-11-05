// src/Services/todoService.js
import Todo from "../Models/todo.js";

export const crearTodo = async (titulo, descripcion, idUsuario, estado = 'pendiente') => {
  const nuevoTodo = await Todo.create({
    titulo,
    descripcion,
    estado,
    idUsuario
  });
  return nuevoTodo;
}

export const obtenerTodosDelUsuario = async (idUsuario) => {
  return await Todo.findAll({ 
    where: { idUsuario },
    order: [['id', 'DESC']] 
  });
}

export const obtenerTodoPorId = async (id, idUsuario) => {
  const todo = await Todo.findOne({
    where: { 
      id,
      idUsuario 
    }
  });
  
  if(!todo) {
    throw new Error('Todo no encontrado o no tienes acceso');
  }
  
  return todo;
}

export const actualizarTodo = async (id, idUsuario, data) => {
  const todo = await Todo.findOne({
    where: { 
      id,
      idUsuario 
    }
  });
  
  if(!todo) {
    throw new Error('Todo no encontrado o no tienes acceso');
  }
  
  const { titulo, descripcion, estado } = data;
  const datosActualizar = {};
  
  if(titulo !== undefined) datosActualizar.titulo = titulo;
  if(descripcion !== undefined) datosActualizar.descripcion = descripcion;
  if(estado !== undefined) datosActualizar.estado = estado;
  
  await todo.update(datosActualizar);
  return todo;
}

export const eliminarTodo = async (id, idUsuario) => {
  const todo = await Todo.findOne({
    where: { 
      id,
      idUsuario 
    }
  });
  
  if(!todo) {
    throw new Error('Todo no encontrado o no tienes acceso');
  }
  
  await todo.destroy();
  return { mensaje: 'Todo eliminado exitosamente' };
}

export const cambiarEstadoTodo = async (id, idUsuario, nuevoEstado) => {
  const estadosValidos = ['pendiente', 'en progreso', 'completado'];
  if(!estadosValidos.includes(nuevoEstado)) {
    throw new Error('Estado inválido. Debe ser: pendiente, en progreso o completado');
  }
  
  const todo = await Todo.findOne({
    where: { 
      id,
      idUsuario 
    }
  });
  
  if(!todo) {
    throw new Error('Todo no encontrado o no tienes acceso');
  }
  
  await todo.update({ estado: nuevoEstado });
  return todo;
}