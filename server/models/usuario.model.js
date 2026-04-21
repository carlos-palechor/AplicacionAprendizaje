const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Rol = require('./rol.model');

const Usuario = sequelize.define('usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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

  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },

  foto: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Rol,
      key: 'id_rol'
    }
  }

}, {
  tableName: 'usuario',
  timestamps: false
});

module.exports = Usuario;