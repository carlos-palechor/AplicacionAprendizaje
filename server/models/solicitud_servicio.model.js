const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Servicio = require('./servicio.model');
const Usuario = require('./usuario.model');

const SolicitudServicio = sequelize.define('solicitud_servicio', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Servicio,
      key: 'id_servicio'
    }
  },

  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },

  descripcion_solicitud: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  fecha_solicitud: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },

  estado: {
    type: DataTypes.STRING(30),
    allowNull: true
  }

}, {
  tableName: 'solicitud_servicio',
  timestamps: false
});

module.exports = SolicitudServicio;