"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        role_id: 1,
        team_id: undefined,
        first_name: "admin",
        second_name: "admin",
        email: "admin@gmail.com",
        password: `${await bcrypt.hashSync("admin", 8)}`,
        status: "Active",
        reason: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role_id: 2,
        team_id: 3,
        first_name: "test2",
        second_name: "test2",
        email: "test2@gmail.com",
        password: `${await bcrypt.hashSync("test2", 8)}`,
        status: "Active",
        reason: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role_id: 3,
        team_id: 3,
        first_name: "test3",
        second_name: "test3",
        email: "test3@gmail.com",
        password: `${await bcrypt.hashSync("test3", 8)}`,
        status: "Active",
        reason: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role_id: 1,
        team_id: undefined,
        first_name: "test4",
        second_name: "test4",
        email: "test4@gmail.com",
        password: `${await bcrypt.hashSync("test4", 8)}`,
        status: "Active",
        reason: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role_id: 2,
        team_id: 2,
        first_name: "test5",
        second_name: "test5",
        email: "test5@gmail.com",
        password: `${await bcrypt.hashSync("test5", 8)}`,
        status: "Active",
        reason: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role_id: 3,
        team_id: 2,
        first_name: "test6",
        second_name: "test6",
        email: "test6@gmail.com",
        password: `${await bcrypt.hashSync("test6", 8)}`,
        status: "Active",
        reason: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
