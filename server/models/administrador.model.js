const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Rol = require('./rol.model');

const Administrador = sequelize.define('administrador', {
  id_administrador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
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
  tableName: 'administrador',
  timestamps: false
});

module.exports = Administrador;
