const Sequelize = require('sequelize');

class student extends Sequelize.Model{
    static initiate(sequelize){
        student.init({
            std_id:{
                type: Sequelize.INTEGER(10),
                allowNull: true,
                primaryKey: true,
            },
            std_nm: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            department: {
                type: Sequelize.INTEGER(10),
                allowNull: false,
            },
            std_no:{	
                type: Sequelize.INTEGER(10),
                allowNull: true,
            },
            std_grade:{	
                type: Sequelize.INTEGER(10),
                allowNull: false,
            },
            max_credit:{	
                type: Sequelize.INTEGER(10),
                allowNull: false,
            },
            std_pw:{	
                type: Sequelize.STRING(20),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false, 
            underscored: false,
            modelName: 'student',
            tableName: 'student',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db){
        db.student.hasOne(db.cart, {foreignkey: 'std_id', sourceKey: 'std_id'});
        db.student.hasMany(db.registration, {foreignkey: 'std_id', sourceKey: 'std_id'});
    }
};

module.exports = student;