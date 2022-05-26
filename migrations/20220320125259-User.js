"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Users", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      second_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      refresh_token: {
        //unique: true,
        allowNull: true,
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Users");
  },
};
