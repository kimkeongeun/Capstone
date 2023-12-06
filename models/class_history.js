const Sequelize = require('sequelize');

class class_history extends Sequelize.Model{
    static initiate(sequelize){
        class_history.init({
            cls_hist_id:{
                type: Sequelize.INTEGER(10),
                allowNull: true,
                primaryKey: true,
            },
            std_id: {
                type: Sequelize.INTEGER(10),
                allowNull: true,
            },
            cls_cord: {
                type: Sequelize.INTEGER(10),
                allowNull: true,
            },
            cls_semester: {
                type: Sequelize.STRING(23),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false, 
            underscored: false,
            modelName: 'class_history',
            tableName: 'class_history',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){}
};

module.exports = class_history;