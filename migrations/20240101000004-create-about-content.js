'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('about_content', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hero_title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      hero_tagline: {
        type: Sequelize.STRING,
        allowNull: true
      },
      history_title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      history_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      history_image_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vision_title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vision_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      mission_title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mission_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      values: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      management: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: []
      },
      contact_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contact_email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contact_address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('about_content');
  }
};

