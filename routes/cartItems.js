const express = require('express');
const CartItem = require('../models/cart_item');
const class_Data = require('../models/class_Data');


const router = express.Router();

router.route('/')
    .get(async (req, res, next) =>{
        try{
            const cartItems = await CartItem.findAll({
                attributes:['cart_id', 'item_id'],
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
        try{
            const cartitem = await CartItem.create({
                cart_id:1,
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
                cart_id:1,
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
            where:{cart_id: 1,},
            });

        res.json(cartItems);

    }catch(err){
        console.error(err);
        next(err);
    }
})


module.exports = router;