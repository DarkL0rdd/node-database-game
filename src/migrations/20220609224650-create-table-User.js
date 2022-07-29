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
        type: DataTypes.INTEGER || DataTypes.NULL,
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
        type: DataTypes.STRING(254),
        allowNull: false,
        unique: true,
        notEmpty: true,
        isEmail: true,
      },
      password: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        notEmpty: true,
      },
      status: {
        type: DataTypes.STRING(100),
        allowNull: false,
        notEmpty: true,
      },
      reason: {
        type: DataTypes.STRING(254),
        allowNull: true,
      },
      refresh_token: {
        type: DataTypes.STRING(2000) || DataTypes.NULL,
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
