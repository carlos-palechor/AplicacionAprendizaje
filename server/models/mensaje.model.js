const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const SolicitudServicio = require('./solicitud_servicio.model');
const Usuario = require('./usuario.model');

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

  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
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