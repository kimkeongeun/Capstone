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



        //사용자 장바구니 조회 후, 없을 시 만듬
        const user_cart = await Cart.findAll({
            attributes:['cart_id'],
            where:{std_id:req.session.std_id,}
        })
        const cat = user_cart[0].dataValues;

        if(user_cart.count === undefined){
            await Cart.create({
                std_id:req.session.std_id,
            })
            const user_cart = await Cart.findAll({
                attributes:['cart_id'],
                where:{std_id:req.session.std_id,}
            })

            const cat = user_cart[0].dataValues;
            req.session.cart_id = cat.cart_id;
        }else{
            req.session.cart_id = cat.cart_id;
        };

        


        
        try{
            const cartItems = await CartItem.findAll({
                attributes:['cart_id', 'item_id'],
                where:{cart_id:req.session.cart_id},
                    include:[{
                        model:class_Data,
                        as: 'classData_id',
                        attributes: ['cls_type', 'cls_cord', 'cls_semester', 'credit', 'cls_name', 'instrunctor', 'pg_time', 'room'],
                    }],
            });
            
            res.json(cartItems);
        }catch(err){
            console.error(err);
            next(err);
        }
    })
    .post(async (req, res, next) =>{
        //id: req.params.id
        console.log(req.body);
        try{
            const cartitem = await CartItem.create({
                cart_id:req.session.cart_id,
                cls_cord: req.body.cord,
                cls_semester: req.body.semester,
            })
            res.status(200).json(cartitem)
        }catch(err){
            console.error(err);
            next(err);
        }
    });

router.route('/:id')
    .delete(async(req, res, next)=>{
        try{
            const result =await CartItem.destroy({
                where:{
                cart_id:req.session.cart_id,
                item_id:req.params.id}
            });
            res.json('지우기 성공');
        }catch(err){
            console.error(err);
            next(err);
        }
    });

router.get('/put', async(req, res, next)=>{
    try{

        const cartItems = await CartItem.findAll({
            attributes:['cls_cord', 'cls_semester'],
            where:{cart_id: req.session.cart_id,},
            });

        res.json(cartItems);

    }catch(err){
        console.error(err);
        next(err);
    }
})


module.exports = router;