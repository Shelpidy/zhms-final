"use strict";
const { v4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersData = [
      {
        userId: v4(),
        firstName: "John",
        lastName: "Doe",
        profileImage: null,
        contactNumber: "1234567890",
        gender: "male",
        dateOfBirth: new Date("1990-01-01"),
        address: "123 Main Street",
        password: "user1", // Replace with the actual hashed password
        email: "john.doe@example.com",
        role: "patient",
      },
      {
        userId: v4(),
        firstName: "Dennis",
        lastName: "Kamara",
        profileImage: null,
        contactNumber: "1234567890",
        gender: "male",
        dateOfBirth: new Date("1990-01-01"),
        address: "123 Main Street",
        password: "hashedpassword1", // Replace with the actual hashed password
        email: "kamaradennis36@gmail.com",
        role: "patient",
      },
      {
        userId: v4(),
        firstName: "Emmanuel",
        lastName: "leo",
        profileImage: null,
        contactNumber: "1234567890",
        gender: "male",
        dateOfBirth: new Date("1990-01-01"),
        address: "123 Main Street",
        password: "user2", // Replace with the actual hashed password
        email: "emmanuel34@gmail.com",
        role: "patient",
      },
      {
        userId: v4(),
        firstName: "pidy",
        lastName: "shel",
        profileImage: null,
        contactNumber: "1234567890",
        gender: "male",
        dateOfBirth: new Date("1990-01-01"),
        address: "123 Main Street",
        password: "user3", // Replace with the actual hashed password
        email: "shelpidy34@gmail.com",
        role: "patient",
      },
      // Add more user data objects as needed
    ];

    return queryInterface.bulkInsert("Users", usersData, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
