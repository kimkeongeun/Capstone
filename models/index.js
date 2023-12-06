const Sequelize = require('sequelize');


const cart_item = require('./cart_item');
const cart = require('./cart');
const class_Data = require('./class_Data');
const class_history = require('./class_history');
const registration = require('./registration');
const student = require('./student');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.cart_item = cart_item;
db.cart = cart;
db.class_Data = class_Data;
db.class_history = class_history;
db.registration = registration;
db.student = student;

cart_item.initiate(sequelize)
cart.initiate(sequelize)
class_Data.initiate(sequelize)
class_history.initiate(sequelize)
registration.initiate(sequelize)
student.initiate(sequelize)

cart_item.associate(db)
cart.associate(db)
class_Data.associate(db)
class_history.associate(db)
registration.associate(db)
student.associate(db)



module.exports = db;
