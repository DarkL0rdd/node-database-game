"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Players requests", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
        isInt: true,
        notEmpty: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        notEmpty: true,
      },
      request_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
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
    return queryInterface.dropTable("Players requests");
  },
};
