const Sequelize = require('sequelize');

class cart extends Sequelize.Model{
    static initiate(sequelize){
        cart.init({
            std_id:{
                type: Sequelize.INTEGER(10),
                allowNull: true,
                primaryKey: true,
            },
            cart_id:{
                type: Sequelize.INTEGER(10),
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
            },
        }, {
            sequelize,
            timestamps: false, 
            underscored: false,
            modelName: 'cart',
            tableName: 'cart',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.cart.belongsTo(db.student, {foreignkey: 'std_id', targetKey: 'std_id'});
        db.cart.hasMany(db.cart_item, {foreignkey: 'cart_id', sourceKey: 'cart_id'});
    }
};

module.exports = cart;