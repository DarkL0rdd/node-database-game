"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Teams", [
      {
        team_name: "Team 1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        team_name: "Team 2",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        team_name: "Stun Seed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Teams", null, {});
  },
};
