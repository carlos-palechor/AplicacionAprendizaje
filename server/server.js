const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./configs/database');
require('./models/associations');
const authRoutes = require('./routes/auth/auth.routes');
const estudianteRoutes = require('./routes/estudiante/estudiante.routes');
const profesionalRoutes = require('./routes/profesional/profesional.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/estudiante', estudianteRoutes);
app.use('/api/profesional', profesionalRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Backend funcionando correctamente'
  });
});

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('El puerto no está definido en el archivo .env');
}



async function startServer() {
  try {
    await sequelize.authenticate();
    console.log(' Conexión a MySQL establecida correctamente');

    app.listen(PORT, () => {
      console.log(` El servidor está corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error(' Error al conectar con la base de datos:', error.message);
  }
}

startServer();
