"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Roles", [
      {
        role: "Admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role: "Manager",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role: "Player",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Roles", null, {});
  },
};
