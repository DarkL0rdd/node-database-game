"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        first_name: "test1",
        //role_id: "", //!
        second_name: "test1",
        email: "test1@gmail.com",
        password: "test1",
        refresh_token: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        first_name: "test2",
        //role_id: "", //!
        second_name: "test2",
        email: "test2@gmail.com",
        password: "test2",
        refresh_token: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        first_name: "test3",
        //role_id: "", //!
        second_name: "test3",
        email: "test3@gmail.com",
        password: "test3",
        refresh_token: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        first_name: "test4",
        //role_id: "", //!
        second_name: "test4",
        email: "test4@gmail.com",
        password: "test4",
        refresh_token: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        first_name: "test5",
        //role_id: "", //!
        second_name: "test5",
        email: "test5@gmail.com",
        password: "test5",
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
