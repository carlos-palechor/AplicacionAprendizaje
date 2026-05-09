const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Rol = require('./rol.model');

const Estudiante = sequelize.define('estudiante', {
  id_estudiante: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    references: {
      model: Rol,
      key: 'id_rol'
    }
  },

  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  correo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },

  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'estudiante',
  timestamps: false
});

module.exports = Estudiante;
