"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        role_id: "1",
        first_name: "admin",
        second_name: "admin",
        email: "admin@gmail.com",
        password: `${await bcrypt.hashSync("admin", 8)}`,
        refresh_token: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
