// src/Routes/todoRoutes.js
import { Router } from 'express';
import * as todoController from '../Controller/todoController.js';
import { 
    crearTodoValidators, 
    actualizarTodoValidators,
    todoIdValidator,
    runValidations 
} from '../Middleware/validator.js';

const router = Router();

router.post(
    '/',
    runValidations(crearTodoValidators),
    todoController.postCrearTodo
);

router.get(
    '/usuario/:idUsuario',
    todoController.getTodosDelUsuario
);

router.get(
    '/:id',
    runValidations(todoIdValidator),
    todoController.getTodoPorId
);

router.put(
    '/:id',
    runValidations(actualizarTodoValidators),
    todoController.putActualizarTodo
);

router.patch(
    '/:id/estado',
    runValidations(todoIdValidator),
    todoController.patchCambiarEstado
);

router.delete(
    '/:id',
    runValidations(todoIdValidator),
    todoController.deleteTodo
);

export default router;