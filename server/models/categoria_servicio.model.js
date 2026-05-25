const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const Administrador = require('./administrador.model');

const CategoriaServicio = sequelize.define('categoria_servicio', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_categoria: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  creado_por_admin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Administrador,
      key: 'id_administrador'
    }
  }
}, {
  tableName: 'categoria_servicio',
  timestamps: false
});

module.exports = CategoriaServicio;
