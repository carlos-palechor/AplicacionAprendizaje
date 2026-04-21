const Rol = require('./rol.model');
const Usuario = require('./usuario.model');
const Profesional = require('./profesional.model');
const CategoriaServicio = require('./categoria_servicio.model');
const Servicio = require('./servicio.model');
const SolicitudServicio = require('./solicitud_servicio.model');
const Mensaje = require('./mensaje.model');
const Calificacion = require('./calificacion.model');

// Rol - Usuario
Rol.hasMany(Usuario, {
  foreignKey: 'id_rol'
});

Usuario.belongsTo(Rol, {
  foreignKey: 'id_rol'
});

// Usuario - Profesional
Usuario.hasOne(Profesional, {
  foreignKey: 'id_usuario'
});

Profesional.belongsTo(Usuario, {
  foreignKey: 'id_usuario'
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

// Usuario - SolicitudServicio
Usuario.hasMany(SolicitudServicio, {
  foreignKey: 'id_usuario'
});

SolicitudServicio.belongsTo(Usuario, {
  foreignKey: 'id_usuario'
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

// Usuario - Mensaje
Usuario.hasMany(Mensaje, {
  foreignKey: 'id_usuario'
});

Mensaje.belongsTo(Usuario, {
  foreignKey: 'id_usuario'
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
  Usuario,
  Profesional,
  CategoriaServicio,
  Servicio,
  SolicitudServicio,
  Mensaje,
  Calificacion
};