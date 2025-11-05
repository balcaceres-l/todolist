// src/Controller/usuarioControllers.js
import * as usuarioService from '../Services/usuarioService.js';

export const getUsuarioPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.obtenerUsuarioPorId(id);
        usuario.password = undefined;

        res.status(200).json(usuario);
    } catch (err) {
        next(err); 
    }
};
export const postCrearUsuario = async (req, res, next) => {
    console.log("LOG: Datos recibidos para registro:", req.body);
    try {
        const { nombre, email, password } = req.body; 

        if (!nombre || !email || !password) {
            const error = new Error("Nombre, email y contraseña son obligatorios");
            error.statusCode = 400;
            throw error;
        }
        const nuevoUsuario = await usuarioService.crearUsuario(nombre, email, password);
        
        res.status(201).json({
            message: "Usuario creado exitosamente",
            usuario: nuevoUsuario
        });
    } catch (err) {
        next(err);
    }
};

export const putActualizarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;
        if (datosActualizados.password) {
            const error = new Error("No se puede actualizar la contraseña desde este endpoint");
            error.statusCode = 400;
            throw error;
        }

        const usuarioActualizado = await usuarioService.actualizarUsuario(id, datosActualizados);
        
        res.status(200).json({
            message: "Usuario actualizado exitosamente",
            usuario: usuarioActualizado
        });
    } catch (err) {
        next(err);
    }
};

export const deleteUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        await usuarioService.eliminarUsuario(id);
        
        res.status(200).json({ 
            message: "Usuario eliminado exitosamente" 
        });
        
    } catch (err) {
        next(err);
    }
};
export const postLoginUsuario = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Correo y contraseña son obligatorios");
            error.statusCode = 400;
            throw error;
        }

        const usuario = await usuarioService.loginUsuario(email, password);
        res.status(200).json({
            message: "Login exitoso",
            usuario: usuario 
        });

    } catch (err) {
        next(err); 
    }
};
export const getUsuarioPorCorreo = async (req, res, next) => {
    try {
        const { email } = req.params;
        const usuario = await usuarioService.obtenerUsuarioPorEmail(email);
        delete usuario.password;

        res.status(200).json(usuario);
    } catch (err) {
        next(err);
    }
};