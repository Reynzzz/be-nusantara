const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HomeContent = sequelize.define('HomeContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hero_title: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "RIDE WITH PASSION"
  },
  hero_tagline: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Bergabunglah dengan komunitas motor terbesar dan terseru di Indonesia"
  },
  bg_video: {
    type: DataTypes.STRING,
    allowNull: true
  },
  about_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cta_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'home_content',
  timestamps: true
});

module.exports = HomeContent;
