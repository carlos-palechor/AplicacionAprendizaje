const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Profesional = require('./profesional.model');
const CategoriaServicio = require('./categoria_servicio.model');

const Servicio = sequelize.define('servicio', {
  id_servicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_profesional: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Profesional,
      key: 'id_profesional'
    }
  },

  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CategoriaServicio,
      key: 'id_categoria'
    }
  },

  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  modalidad: {
    type: DataTypes.STRING(50),
    allowNull: true
  },

  tiempo_estimado: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  fecha_publicacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },

  estado: {
    type: DataTypes.STRING(30),
    allowNull: true
  }

}, {
  tableName: 'servicio',
  timestamps: false
});

module.exports = Servicio;