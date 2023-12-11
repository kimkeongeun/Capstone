const Sequelize = require('sequelize');

class registration extends Sequelize.Model{
    static initiate(sequelize){
        registration.init({
            reg_id:{
                type: Sequelize.INTEGER(10),
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
            },
            std_id:{
                type: Sequelize.INTEGER(10),
                allowNull: true,
                primaryKey: true,
            },
            cls_cord: {
                type: Sequelize.INTEGER(10),
                allowNull: true,
            },
            cls_semester: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false, 
            underscored: false,
            modelName: 'registration',
            tableName: 'registration',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db){
        db.registration.belongsTo(db.student, {foreignkey: 'std_id', sourceKey: 'std_id'});
        db.registration.belongsTo(db.class_Data, { foreignKey: 'cls_cord', targetKey: 'cls_cord', as: 'clsData_id' });
    }

    
};

module.exports = registration;
