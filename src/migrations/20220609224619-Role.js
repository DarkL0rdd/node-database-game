"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Roles", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
        isInt: true,
        notEmpty: true,
      },
      role_name: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        notEmpty: true,
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
    return queryInterface.dropTable("Roles");
  },
};
