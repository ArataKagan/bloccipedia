'use strict';

const faker = require("faker");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync();
const hashedPassword = bcrypt.hashSync("fakePassword", salt);

let users = [];
for(let i = 1; i <= 5; i++){
  users.push({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete("Users", null, {});
  }
};
