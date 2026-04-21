const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Usuario = require('./usuario.model');

const Profesional = sequelize.define('profesional', {
  id_profesional: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },

  universidad: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  titulo_profesional: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  especializacion: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  descripcion_perfil: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  linkedin_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  disponibilidad: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  verificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

}, {
  tableName: 'profesional',
  timestamps: false
});

module.exports = Profesional;