const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./configs/database');
require('./models/associations');
const authRoutes = require('./routes/auth/auth.routes');
const administradorRoutes = require('./routes/administrador/administrador.routes');
const categoriaRoutes = require('./routes/categoria/categoria.routes');
const estudianteRoutes = require('./routes/estudiante/estudiante.routes');
const profesionalRoutes = require('./routes/profesional/profesional.routes');
const servicioRoutes = require('./routes/servicio/servicio.routes');
const solicitudServicioRoutes = require('./routes/solicitud_servicio/solicitud_servicio.routes');
const mensajeRoutes = require('./routes/mensaje/mensaje.routes');
const calificacionRoutes = require('./routes/calificacion/calificacion.routes');
const publicoRoutes = require('./routes/publico/publico.routes');
const {
  normalizarRespuestasDeError,
  manejarRutaNoEncontrada,
  manejarErrorGlobal
} = require('./middlewares/error/error.middleware');

const app = express();

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(normalizarRespuestasDeError);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/administrador', administradorRoutes);
app.use('/api/categoria_servicio', categoriaRoutes);
app.use('/api/estudiante', estudianteRoutes);
app.use('/api/profesional', profesionalRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/solicitud_servicio', solicitudServicioRoutes);
app.use('/api/mensaje', mensajeRoutes);
app.use('/api/calificacion', calificacionRoutes);
app.use('/api/publico', publicoRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Backend funcionando correctamente'
  });
});

app.use(manejarRutaNoEncontrada);
app.use(manejarErrorGlobal);

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
