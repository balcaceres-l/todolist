import sequelize from './db.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import initModels from '../Models/initModels.js';
import usuarioRoutes from '../Routes/usuarioRoutes.js';
import {errorHandler} from '../Middleware/errorHandler.js';
import todoRoutes from '../Routes/todoRoutes.js';
import '../Models/asociaciones.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('El servidor está funcionando correctamente.');
});
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/todos', todoRoutes);
app.use(errorHandler);
const PORT = process.env.PORT;
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('Conexión a la base de datos establecida');
      const models = initModels();
      await sequelize.sync({ alter: false });
      console.log('Base de datos sincronizada');
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`)
        ;
      });
      break; 
    } catch (error) {
      console.error(`Error de conexión a la base de datos (intento ${i + 1} de ${retries}):`, error);
      if (i < retries - 1) {
        console.log(`Reintentando en ${delay / 1000} segundos...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('No se pudo conectar a la base de datos después de varios intentos.');
      }
    }
  }
};
connectWithRetry();