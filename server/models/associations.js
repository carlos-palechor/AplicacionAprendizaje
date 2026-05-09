const Rol = require('./rol.model');
const Estudiante = require('./estudiante.model');
const Profesional = require('./profesional.model');
const CategoriaServicio = require('./categoria_servicio.model');
const Servicio = require('./servicio.model');
const SolicitudServicio = require('./solicitud_servicio.model');
const Mensaje = require('./mensaje.model');
const Calificacion = require('./calificacion.model');

// Rol - Estudiante
Rol.hasMany(Estudiante, {
  foreignKey: 'id_rol'
});

Estudiante.belongsTo(Rol, {
  foreignKey: 'id_rol'
});

// Rol - Profesional
Rol.hasMany(Profesional, {
  foreignKey: 'id_rol'
});

Profesional.belongsTo(Rol, {
  foreignKey: 'id_rol'
});

// Profesional - Servicio
Profesional.hasMany(Servicio, {
  foreignKey: 'id_profesional'
});

Servicio.belongsTo(Profesional, {
  foreignKey: 'id_profesional'
});

// CategoriaServicio - Servicio
CategoriaServicio.hasMany(Servicio, {
  foreignKey: 'id_categoria'
});

Servicio.belongsTo(CategoriaServicio, {
  foreignKey: 'id_categoria'
});

// Estudiante - SolicitudServicio
Estudiante.hasMany(SolicitudServicio, {
  foreignKey: 'id_estudiante'
});

SolicitudServicio.belongsTo(Estudiante, {
  foreignKey: 'id_estudiante'
});

// Servicio - SolicitudServicio
Servicio.hasMany(SolicitudServicio, {
  foreignKey: 'id_servicio'
});

SolicitudServicio.belongsTo(Servicio, {
  foreignKey: 'id_servicio'
});

// SolicitudServicio - Mensaje
SolicitudServicio.hasMany(Mensaje, {
  foreignKey: 'id_solicitud'
});

Mensaje.belongsTo(SolicitudServicio, {
  foreignKey: 'id_solicitud'
});

// Estudiante - Mensaje
Estudiante.hasMany(Mensaje, {
  foreignKey: 'id_estudiante'
});

Mensaje.belongsTo(Estudiante, {
  foreignKey: 'id_estudiante'
});

// SolicitudServicio - Calificacion
SolicitudServicio.hasOne(Calificacion, {
  foreignKey: 'id_solicitud'
});

Calificacion.belongsTo(SolicitudServicio, {
  foreignKey: 'id_solicitud'
});

module.exports = {
  Rol,
  Estudiante,
  Profesional,
  CategoriaServicio,
  Servicio,
  SolicitudServicio,
  Mensaje,
  Calificacion
};
