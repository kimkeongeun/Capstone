const express = require('express');
const Cart = require('../models/cart');
const CartItem = require('../models/cart_item');
const class_Data = require('../models/class_Data');
const std = require('../models/student');


const router = express.Router();

router.route('/')
    .get(async (req, res, next) =>{
        const stdents = await std.findAll({
            attributes:['std_id'],
            where:{std_no:req.session.std_no, std_pw:req.session.std_pw}
        });
        
        const stu = stdents[0].dataValues;
        console.log("Student with std_id:", stu.std_id);
        req.session.std_id = stu.std_id;

        
        try{
            const std_data = await std.findAll({
                attributes:['department', 'std_grade', 'std_nm', 'std_no', 'max_credit'],
                where:{std_id:req.session.std_id},
            });
            
            res.json(std_data);
        }catch(err){
            console.error(err);
            next(err);
        }
    });


module.exports = router;