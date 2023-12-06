const Sequelize = require('sequelize');

class cart_item extends Sequelize.Model{
    static initiate(sequelize){
        cart_item.init({
            item_id:{
                type: Sequelize.INTEGER(10),
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
            },
            cart_id:{
                type: Sequelize.INTEGER(10),
                allowNull: true,
                primaryKey: true,
            },
            cls_cord: {
                type: Sequelize.INTEGER(10),
                allowNull: true,
                freezeTableName: true,
            },
            cls_semester: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false, 
            underscored: false,
            modelName: 'cart_item',
            tableName: 'cart_item',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            freezeTableName: true,
        });
    }

    static associate(db){
        db.cart_item.belongsTo(db.cart, {foreignkey:'cart_id', targetKey: 'cart_id'});
        db.cart_item.belongsTo(db.class_Data, { foreignKey: 'cls_cord', targetKey: 'cls_cord', as: 'classData_id' });
        
    }
};

module.exports = cart_item;