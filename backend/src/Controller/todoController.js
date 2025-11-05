// src/Controllers/todoController.js
import * as todoService from '../Services/todoService.js';

export const postCrearTodo = async (req, res, next) => {
    try {
        const { titulo, descripcion, estado, idUsuario } = req.body;

        if (!titulo || !descripcion || !idUsuario) {
            const error = new Error("Título, descripción e idUsuario son obligatorios");
            error.statusCode = 400;
            throw error;
        }

        const nuevoTodo = await todoService.crearTodo(titulo, descripcion, idUsuario, estado);
        
        res.status(201).json({
            message: "Todo creado exitosamente",
            todo: nuevoTodo
        });
    } catch (err) {
        next(err);
    }
};

export const getTodosDelUsuario = async (req, res, next) => {
    try {
        const { idUsuario } = req.params;

        const todos = await todoService.obtenerTodosDelUsuario(idUsuario);
        
        res.status(200).json({
            todos
        });
    } catch (err) {
        next(err);
    }
};

export const getTodoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { idUsuario } = req.query;

        if (!idUsuario) {
            const error = new Error("idUsuario es obligatorio");
            error.statusCode = 400;
            throw error;
        }

        const todo = await todoService.obtenerTodoPorId(id, idUsuario);
        
        res.status(200).json({
            todo
        });
    } catch (err) {
        next(err);
    }
};

export const putActualizarTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { idUsuario, ...data } = req.body;

        if (!idUsuario) {
            const error = new Error("idUsuario es obligatorio");
            error.statusCode = 400;
            throw error;
        }

        const todoActualizado = await todoService.actualizarTodo(id, idUsuario, data);
        
        res.status(200).json({
            message: "Todo actualizado exitosamente",
            todo: todoActualizado
        });
    } catch (err) {
        next(err);
    }
};

export const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { idUsuario } = req.body;

        if (!idUsuario) {
            const error = new Error("idUsuario es obligatorio");
            error.statusCode = 400;
            throw error;
        }

        const resultado = await todoService.eliminarTodo(id, idUsuario);
        
        res.status(200).json(resultado);
    } catch (err) {
        next(err);
    }
};

export const patchCambiarEstado = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado, idUsuario } = req.body;

        if (!estado || !idUsuario) {
            const error = new Error("Estado e idUsuario son obligatorios");
            error.statusCode = 400;
            throw error;
        }

        const todoActualizado = await todoService.cambiarEstadoTodo(id, idUsuario, estado);
        
        res.status(200).json({
            message: "Estado actualizado exitosamente",
            todo: todoActualizado
        });
    } catch (err) {
        next(err);
    }
};