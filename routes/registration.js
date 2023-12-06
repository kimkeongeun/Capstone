const express = require('express');
const class_Data = require('../models/class_Data');
const regis = require('../models/registration')


const router = express.Router();

router.route('/')
    .post(async (req, res, next) =>{
        try{
            console.log('1차 완료')
            console.log(req.body.cord)
            console.log(req.body.semester)
            console.log(req.body.time)

            
            //일단 담긴 모든 과목을 가져옴
            const registration = await regis.findAll({
                attributes:['cls_cord', 'cls_semester'],
                where:[{
                    std_id:1,
                }],
            });

            let test = 0;

            for(const REG_TM of registration){
                //과목 겹치는지 비교
                if(REG_TM.cls_cord===req.body.cord && REG_TM.cls_semester===req.body.semester){
                    test = 1;
                    break;
                }
                //클래스 코드와 년도를 바탕으로 시간 불러옴.
                const class_TM = await class_Data.findOne({
                    attributes:['pg_time'],
                    where:[{
                        cls_cord: REG_TM.cls_cord,
                        cls_semester: REG_TM.cls_semester,
                    }],
                });
                //과목 시간 비교
                if(class_TM.pg_time ===req.body.time){
                    test = 2;
                    break;
                };
            };

            if(test===0){
                const registration = await regis.create({
                std_id:1,
                cls_cord: req.body.cord,
                cls_semester: req.body.semester,
                })
                console.log('2차 완료')
                res.status(200).json('담기 성공');
            }else if(test===1){
                console.log('이미 담긴 과목')
                res.status(200).json('이미 담긴 과목. 담기 실패');
            }else if(test===2){
                console.log('이미 같은시간이 있음')
                res.status(200).json('이미 같은시간이 있음. 담기 실패');
            }
             
             
        }catch(err){
            console.error(err);
            next(err);
        }
    });

module.exports = router;