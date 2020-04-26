const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite'
});
const Suggestions = sequelize.define('suggestions', {
  uuid: {
    type: Sequelize.STRING,
    unique: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  description: {
    type: Sequelize.STRING,
    unique: true
  },
  user_id: {
    type: Sequelize.STRING
  },
  suggestion_id: {
    type: Sequelize.STRING
  },
  todolist_id: {
    type: Sequelize.STRING
  },
  doability: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING
  }
});

module.exports = Suggestions;
