const express = require('express');
const Cart = require('../models/cart');
const CartItem = require('../models/cart_item');
const class_Data = require('../models/class_Data');

const router = express.Router();

router.get('/', async (req, res, next) =>{
    try{
        const c_data = await class_Data.findAll({
            attributes:['cls_cord', 'cls_semester','cls_name', 'pg_time', 'credit'],
        });

        const cartItems = await CartItem.findAll({
            attributes:['cart_id'],
                include:[{
                    model:class_Data,
                    as: 'classData_id',
                    attributes: ['cls_type', 'cls_cord', 'cls_semester', 'credit', 'cls_name', 'instrunctor', 'pg_time', 'room'],
                }],
        });

        //사용자 장바구니 조회 후, 없을 시 만듬
        const user_cart = await Cart.findAll({
            attributes:['cart_id'],
            where:{std_id:1,}
        })
        if(user_cart.count === undefined){
            await Cart.create({
                std_id:1,
            })

        };




        res.render('sequelize',{c_data, cartItems});
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;