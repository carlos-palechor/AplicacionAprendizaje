const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const SolicitudServicio = require('./solicitud_servicio.model');


const Calificacion = sequelize.define('calificacion', {
  id_calificacion: {
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

  puntuacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  comentario: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  fecha_calificacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'calificacion',
  timestamps: false
});

module.exports = Calificacion;