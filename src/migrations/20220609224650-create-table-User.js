"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Users", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        notEmpty: true,
        isInt: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        notEmpty: true,
        isInt: true,
        allowNull: false,
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
      },
      second_name: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        notEmpty: true,
        isEmail: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        underscored: true,
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
        notEmpty: true,
      },
      updatedAt: {
        underscored: true,
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: false,
        notEmpty: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Users");
  },
};
