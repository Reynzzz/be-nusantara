'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'categoryId', {
      type: Sequelize.INTEGER,
      // allowNull: true initially to avoid errors with existing data, 
      // but should ideally be linked. We won't enforce FK constraint strictly here to keep it simple unless needed.
      references: {
        model: 'categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    
    // We can choose to drop the old column or keep it. 
    // To match the model, we should probably drop it, but safety first: let's keep it in DB but unused in model for a moment, 
    // or just drop it if we are confident. 
    // Given the user request "Change category field", let's drop it to avoid confusion.
    await queryInterface.removeColumn('products', 'category');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'categoryId');
    await queryInterface.addColumn('products', 'category', {
      type: Sequelize.ENUM('jersey', 'jaket', 'aksesoris', 'sparepart'),
      allowNull: false // This might fail if data was created without it, but suitable for down migration
    });
  }
};
