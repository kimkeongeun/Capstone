const Sequelize = require('sequelize');

class class_Data extends Sequelize.Model{
    static initiate(sequelize){
        class_Data.init({
            cls_cord: {
                type: Sequelize.INTEGER(10),
                allowNull: true,
                primaryKey: true,
                freezeTableName: true,
            },
            cls_semester: {
                type: Sequelize.STRING(30),
                allowNull: true,
                primaryKey: true,
                freezeTableName: true,
            },
            cls_name: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
            instrunctor: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            room: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            pg_time:{	
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            credit:{	
                type: Sequelize.INTEGER(10),
                allowNull: true,
            },
            lecture_hours:{	
                type: Sequelize.INTEGER(10),
                allowNull: true,
            },
            max_std:{	
                type: Sequelize.INTEGER(10),
                allowNull: false,
            },
            remarks:{	
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            cls_type:{	
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            detailed_area:{	
                type: Sequelize.STRING(30),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false, 
            underscored: false,
            modelName: 'class',
            tableName: 'class',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            freezeTableName: true,
        });
    }

    static associate(db){
        db.class_Data.hasMany(db.cart_item, {foreignkey:'cls_cord', sourceKey: 'cls_cord', as: 'classData_id' });
    }
};

module.exports = class_Data;