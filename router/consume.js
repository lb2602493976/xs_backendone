/*处理路由地址中所有以/consume开头的请求*/
const express = require('express')
const pool = require('../pool.js')
router = express.Router()
// 处理订单流水列表
/*
接口URL
{{url}}/consume/list
请求方式
GET
请求查询字符串参数
参数	示例值	必填	参数描述
成功响应示例
[
        {
            "cid": 1,
            "cdate": "2019-11-26",
            "expent": 20,
            "balance": 80,
        },
        .......
]

*/
// 查询
router.get('/list', (req, res, next) => {
    //获取信息
    // let uid=req.uid    //登录中间件检查req中添加req.uid属性
    //2.执行sql
    // let vid=req.query.vid   //vip序号编号
    // let vname=req.query.vname  //vip表会员名称
    // let vip_card=req.query.vip_card  //vip表会员卡号
    // let vip_money=req.query.vip_money   //vip表充值金额
    // let cid=req.query.cid       //cousume表 cid自增
    let vip_id=req.query.vip_id    //cousume表 vip_id=vid
    // let cdate=req.query.cdate      //cousume表  修改日期
    // let expent=req.query.expent      //cousume表 消费金额
    // let balance=req.query.balance    //cousume表 余额

    let sql2 = "SELECT cid,vip_id,cdate,balance FROM consume WHERE vip_id=?"
    // 3.获取响应数据
    pool.query(sql2,vip_id,(err, result) => {
        if (err) {
            next(err)
            return
        }
        res.send(result)
        console.log(result)
    })
})
//添加
router.post('/add', (req, res, next) => {
    //获取信息
    // let uid=req.uid    //登录中间件检查req中添加req.uid属性
    //2.执行sql
    // let vid=req.query.vid   //vip序号编号
    // let vname=req.query.vname  //vip表会员名称
    // let vip_card=req.query.vip_card  //vip表会员卡号
    // let vip_money=req.query.vip_money   //vip表充值金额
    // let cid=req.query.cid       //cousume表 cid自增
    
})

module.exports = router