'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('home_content', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hero_title: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "RIDE WITH PASSION"
      },
      hero_tagline: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Bergabunglah dengan komunitas motor terbesar dan terseru di Indonesia"
      },
      bg_video: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('home_content');
  }
};
