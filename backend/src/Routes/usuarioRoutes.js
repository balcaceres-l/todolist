// src/Routes/usuarioRoutes.js
import { Router } from 'express';
import * as usuarioController from '../Controller/usuarioControllers.js';
import { 
    createUserValidators, 
    loginValidators,
    runValidations 
} from '../Middleware/validator.js';

const router = Router();
router.post(
    '/registro',
    runValidations(createUserValidators),
    usuarioController.postCrearUsuario
);
router.post(
    '/login',
    runValidations(loginValidators),
    usuarioController.postLoginUsuario
);

router.get('/:id', usuarioController.getUsuarioPorId);

router.put('/:id', usuarioController.putActualizarUsuario);
router.get('/correo/:email', usuarioController.getUsuarioPorCorreo);
router.delete('/:id', usuarioController.deleteUsuario);

export default router;