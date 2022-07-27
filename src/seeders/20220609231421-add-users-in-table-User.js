"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        role_id: 1,
        team_id: undefined,
        first_name: "Admin1",
        second_name: "Admin1",
        email: "admin1@gmail.com",
        password: `${await bcrypt.hashSync("adminadmin1", 8)}`,
        status: "Active",
        reason: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role_id: 2,
        team_id: 3,
        first_name: "Test1",
        second_name: "Test1",
        email: "test1@gmail.com",
        password: `${await bcrypt.hashSync("testtest1", 8)}`,
        status: "Active",
        reason: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role_id: 3,
        team_id: 3,
        first_name: "Test2",
        second_name: "Test2",
        email: "test2@gmail.com",
        password: `${await bcrypt.hashSync("testtest2", 8)}`,
        status: "Active",
        reason: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role_id: 1,
        team_id: undefined,
        first_name: "Admin2",
        second_name: "Admin2",
        email: "admin2@gmail.com",
        password: `${await bcrypt.hashSync("adminadmin2", 8)}`,
        status: "Active",
        reason: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role_id: 2,
        team_id: 2,
        first_name: "Test3",
        second_name: "Test3",
        email: "test3@gmail.com",
        password: `${await bcrypt.hashSync("testtest3", 8)}`,
        status: "Active",
        reason: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        role_id: 3,
        team_id: 2,
        first_name: "Test4",
        second_name: "Test4",
        email: "test4@gmail.com",
        password: `${await bcrypt.hashSync("testtest4", 8)}`,
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
