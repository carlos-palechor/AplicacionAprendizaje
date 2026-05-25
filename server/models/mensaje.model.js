const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const SolicitudServicio = require('./solicitud_servicio.model');
const Estudiante = require('./estudiante.model');
const Profesional = require('./profesional.model');

const Mensaje = sequelize.define('mensaje', {
  id_mensaje: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_solicitud: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SolicitudServicio,
      key: 'id_solicitud'
    }
  },

  id_estudiante: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Estudiante,
      key: 'id_estudiante'
    }
  },

  id_profesional: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Profesional,
      key: 'id_profesional'
    }
  },

  tipo_emisor: {
    type: DataTypes.STRING(30),
    allowNull: false
  },

  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  fecha_envio: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'mensaje',
  timestamps: false
});

module.exports = Mensaje;
