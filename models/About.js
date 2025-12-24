const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const About = sequelize.define('About', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hero_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hero_tagline: {
    type: DataTypes.STRING,
    allowNull: true
  },
  home_hero_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  home_hero_tagline: {
    type: DataTypes.STRING,
    allowNull: true
  },
  home_bg_video: {
    type: DataTypes.STRING,
    allowNull: true
  },
  history_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  history_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  history_image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vision_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  vision_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mission_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mission_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  values: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  member_benefits: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  member_registration_link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  management: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  contact_phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact_address: {
    type: DataTypes.TEXT,
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
  tableName: 'about_content',
  timestamps: true
});

module.exports = About;
