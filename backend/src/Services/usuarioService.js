// backend/src/Services/usuarioService.js
import Usuario from '../Models/usuario.js';
import Todo from '../Models/todo.js';
import bcrypt from 'bcrypt';

export const crearUsuario = async(nombre, email, password) => {
  const usuarioExistente = await obtenerUsuarioPorEmail(email, true);
  if(usuarioExistente) {
    throw new Error('El email ya está registrado');
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const nuevoUsuario = await Usuario.create({
    nombre,
    email,
    password: hashedPassword
  });
  const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();
  return usuarioSinPassword;
}

export const obtenerUsuarioPorEmail = async(email, includePassword = false) => {
  const attributes = includePassword ? undefined : { exclude: ['password'] };
  return await Usuario.findOne({ 
    where: { email },
    attributes 
  });
}

export const obtenerUsuarioPorId = async(id, includePassword = false) => {
  const attributes = includePassword ? undefined : { exclude: ['password'] };
  return await Usuario.findByPk(id, { attributes });
}

export const loginUsuario = async(email, password) => {
  const usuario = await obtenerUsuarioPorEmail(email, true);
  if(!usuario) {
    throw new Error('Usuario no encontrado');
  }
  
  const passwordMatch = await bcrypt.compare(password, usuario.password);
  if(!passwordMatch) {
    throw new Error('Contraseña incorrecta');
  }
  
  const { password: _, ...usuarioSinPassword } = usuario.toJSON();
  return usuarioSinPassword;
}

export const obtenerTodosDelUsuario = async(idUsuario) => {
  const usuario = await Usuario.findByPk(idUsuario, {
    attributes: { exclude: ['password'] },
    include: [{ model: Todo }]
  });
  
  if(!usuario) {
    throw new Error('Usuario no encontrado');
  }
  
  return usuario;
}

export const eliminarUsuario = async(id) => {
  const usuario = await Usuario.findByPk(id);
  if(!usuario) {
    throw new Error('Usuario no encontrado');
  }
  
  return await Usuario.destroy({ where: { id } });
}
export const actualizarUsuario = async (id, datosActualizados) => {
    try {
        const usuario = await buscarUsuarioPorId(id); 

        const { nombre, email } = datosActualizados;
        if (email && email !== usuario.email) {
            const existeEmail = await Usuario.findOne({ 
                where: {
                    email,
                    id: { [Op.ne]: id } // [Op.ne] significa "Not Equal" (distinto de)
                }
            });

            if (existeEmail) {
                const error = new Error("El nuevo correo electrónico ya está en uso");
                error.statusCode = 400;
                throw error;
            }
        }
        usuario.nombre = nombre || usuario.nombre;
        usuario.email = email || usuario.email;

        await usuario.save();

        delete usuario.password;
        return usuario;

    } catch (err) {
        throw err;
    }
};