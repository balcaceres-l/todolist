// backend/src/Middleware/validator.js
import { body, validationResult, param } from "express-validator";

export const runValidations = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const error = new Error("Errores de validación");
    error.statusCode = 400;
    error.errors = errors.array();

    return next(error);
  };
};

export const createUserValidators = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  
  body("email") 
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido")
    .normalizeEmail(),
  
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
];

export const loginValidators = [
  body("email") 
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido")
    .normalizeEmail(),
  
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
];

export const crearTodoValidators = [ 
  body("titulo")
    .trim()
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 1, max: 100 })
    .withMessage("El título debe tener entre 1 y 100 caracteres"),
  
  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 1, max: 500 })
    .withMessage("La descripción debe tener entre 1 y 500 caracteres"),
  
  body("estado")
    .optional() 
    .isIn(['pendiente', 'en progreso', 'completado'])
    .withMessage("El estado debe ser: pendiente, en progreso o completado")
];

export const actualizarTodoValidators = [ 
  param("id") 
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número válido"),
  
  body("titulo")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El título no puede estar vacío")
    .isLength({ min: 1, max: 100 })
    .withMessage("El título debe tener entre 1 y 100 caracteres"),
  
  body("descripcion")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía")
    .isLength({ min: 1, max: 500 })
    .withMessage("La descripción debe tener entre 1 y 500 caracteres"),
  
  body("estado")
    .optional()
    .isIn(['pendiente', 'en progreso', 'completado'])
    .withMessage("El estado debe ser: pendiente, en progreso o completado")
];

export const todoIdValidator = [ 
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número válido")
];