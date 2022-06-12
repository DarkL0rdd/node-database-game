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
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        notEmpty: true,
      },
      second_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        notEmpty: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        notEmpty: true,
        isEmail: true,
      },
      password: {
        type: DataTypes.STRING(150),
        allowNull: false,
        notEmpty: true,
      },
      refresh_token: {
        type: DataTypes.STRING(500),
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
