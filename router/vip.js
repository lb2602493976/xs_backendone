/*处理路由地址中所有以/teacher开头的请求*/
const express = require('express')
const pool = require('../pool.js')
router = express.Router()

module.exports = router
/*
2.	获取vip列表
接口URL
{{url}}/vip/list?format=short
请求方式
GET
请求查询字符串参数
参数	示例值	必填	参数描述
format	short或full	否	short：默认值，返回简短的讲师列表（不包含经验和风格）
full：返回完整的讲师列表（包含经验和风格）
成功响应示例
[
        {
            "vid": 1,
            "vname": "成亮",
            "vphone": "Web开发讲师",
            "tpic": "img-teacher\/zx.jpg",
            "experience": "达内集团web讲师， 主讲 HTML5、Jquery、 Ajax 等课程。先后在一汽启明、日本インタセクト等公司担任系统开发工程师，从事软件开发和设计工作，迄今已积累5年以上的开发及教学经验，兼具技术和教学两方面的培训能力。",
            "style": "教学思路严谨，课堂气氛活跃。讲解时善于运用生活当中的例子，使学员能够快速理解。着重培养学员的动手能力，奉行实践是检验真理的唯一标准，教学能力受到学员们的一致好评。"
        },
        .......
]

*/
// 1.查询数据
// get请求
// 127.0.0.1:5050/vip/list
// 成功响应
// [
    // {
    //     "vid": 1,
    //     "vname": "张三",
    //     "vphone": "13227023076",
    //     "vip_card": "132222200",
    //     "vip_money": 100,
    //     "vip_people": "林十一",
    //     "sex": "男",
    //     "age": "21",
    //     "birthday": "2019-11-26",
    //     "address": "陕西省西安市"
    // },
    // {
    //     "vid": 2,
    //     "vname": "李四",
    //     "vphone": "13227023076",
    //     "vip_card": "1322222211",
    //     "vip_money": 200,
    //     "vip_people": "林十一",
    //     "sex": "男",
    //     "age": "21",
    //     "birthday": "2019-11-26",
    //     "address": "陕西省西安市"
    // }]
router.get('/list', (req, res, next) => {
    console.log(req.query)
        let vip_card=req.query.vip_card
        let vname=req.query.vname
        let vphone=req.query.vphone
        let vip_people=req.query.vip_people
        let keys = [],values=[];
        
        if(Boolean(req.query.vip_card)){
            keys.push('vip_card=?') 
            values.push(vip_card)
        } 
        if(Boolean(req.query.vname)) {
            keys.push('vname=?')
            values.push(vname)
        }
        if(Boolean(req.query.vphone)){
            keys.push('vphone=?')
            values.push(vphone)
        } 
        if(Boolean(req.query.vip_people)){
            keys.push('vip_people=?')
            values.push(vip_people)
        } 

        if(keys.length){
            keys= keys.join(' AND ')
            keys = 'WHERE ' + keys
        } 
    
        let sql1 = `SELECT vid,vname,vphone,vip_card,vip_money,vip_people,sex,age,birthday,address FROM vip ${keys}`
        console.log(sql1,values)
        console.log(req.query)
        // let sql1 = `SELECT vid,vname,vphone,vip_card,vip_money,vip_people,sex,age,birthday,address FROM vip`
        pool.query(sql1,values,(err, result) => {
            if (err) {
                next(err)
                return
            }
            res.send(result)
            console.log(result)
        })
    })

// 2.新增数据
// post请求
// 请求头
// {
//     "vname":"linbo",
//     "vphone":"13299999999",
//     "vip_card":"5",
//     "vip_money":200,
//     "vip_people":"",
//     "sex":"男",
//     "age":"",
//     "birthday":"",
//     "address":""
//  }
// 成功响应消息
// code: 200,
// msg: 'Insert the success',
// uid: result.insertId
//}
router.post('/add',(req,res,next)=>{
    // 1.获取信息
    let uid=req.uid    //登录中间件检查req中添加req.uid属性
    // 会员姓名
    let vname=req.body.vname
    console.log(vname)
    if(!vname){
        let output = {
			code: 401,
			msg: 'vname required'
    }
    res.send(output)
    return
    }
    // 会员手机号
    let vphone=req.body.vphone
    if(!vphone){
        let output = {
			code: 402,
			msg: 'vphone required'
    }
    res.send(output)
    return
    }
    // vip会员卡号
    let vip_card=req.body.vip_card
    if(!vip_card){
        let output = {
			code: 403,
			msg: 'vip_card required'
    }
    res.send(output)
    return
    }
    // 会员余额
    let vip_money=req.body.vip_money
    if(!vip_money){
        let output = {
			code: 404,
			msg: 'vip_money required'
    }
    res.send(output)
    return
    }
    // 性别
    let sex=req.body.sex
    if(!sex){
        let output = {
			code: 405,
			msg: 'sex required'
    }
    res.send(output)
    return
    }
    let vip_people=req.body.vip_people
    let age=req.body.age
    let birthday=req.body.birthday
    let address=req.body.address

    // 2.执行数据库插入操作
    let sql1="SELECT vid FROM vip WHERE vip_card=?"
    pool.query(sql1,vip_card,(err,result)=>{
        if(err){
            next(err)
            return
        }
        if(result.length>0){
            // 查询相关记录
            let output={
                code:400,
                msg:'vip_card alredy taken'
            }
            res.send(output)
            return
        } 
        // 继续执行
        let sql2='INSERT INTO vip(vname,vphone,vip_card,vip_money,vip_people,sex,age,birthday,address) VALUES(?,?,?,?,?,?,?,?,?)'
        pool.query(sql2,[vname,vphone,vip_card,vip_money,vip_people,sex,age,birthday,address],(err,result)=>{
            if(err){
              next(err)
              return
            }
            // 3.向客户端输出响应消息
        if (result.affectedRows == 1) {
            let output = {
                code: 200,
                msg: 'Insert the success',
                uid: result.insertId
            }
            console.log(result)
            res.send(output)
        } else {
            let output = {
                code: 404,
                msg: 'Insert the failure'
            }
            res.send(output)
        }
        
    
     })      

    })
})

// 3.修改数据
// post请求  127.0.0.1:5050/vip/update
// 请求主体
// {
//     "vname":"linbo",
//     "vphone":"13299999999",
//     "vip_card":"9",
//     "vip_money":200,
//     "vip_people":"",
//     "sex":"男",
//     "age":"",
//     "birthday":"",
//     "address":"",
//     "vid":1
//  }

// 响应成功
//  code: 200,
// msg: 'update the success',
// uid: result.insertId

router.post("/update",(req,res,next)=>{
    // req.send({code:200,msg:'123',data:1})
    // 1.获取信息
    // 会员姓名
    let vname=req.body.vname
    console.log(vname)
    if(!vname){
        let output = {
			code: 401,
			msg: 'vname required'
    }
    res.send(output)
    return
    }
    // 会员手机号
    let vphone=req.body.vphone
    if(!vphone){
        let output = {
			code: 402,
			msg: 'vphone required'
    }
    res.send(output)
    return
    }
    // vip会员卡号
    let vip_card=req.body.vip_card
    if(!vip_card){
        let output = {
			code: 403,
			msg: 'vip_card required'
    }
    res.send(output)
    return
    }
    // 会员余额
    let vip_money=req.body.vip_money
    if(!vip_money){
        let output = {
			code: 404,
			msg: 'vip_money required'
    }
    res.send(output)
    return
    }
    // 性别
    let sex=req.body.sex
    if(!sex){
        let output = {
			code: 405,
			msg: 'sex required'
    }
    res.send(output)
    return
    }
    let vip_people=req.body.vip_people
    let age=req.body.age
    let birthday=req.body.birthday
    let address=req.body.address
    let vid=req.body.vid
    // 2.执行sql
    // 2.1执行数据库操作查询操作卡号是否重复
    // let sql1="SELECT vid FROM vip WHERE vip_card=?"
    // pool.query(sql1,vip_card,(err,result)=>{
    //     if(err){
    //         next(err)
    //         return
    //     }
    //     if(result.length>0){
    //         // 查询相关记录
    //         let output={
    //             code:400,
    //             msg:'vip_card alredy taken'
    //         }
    //         res.send(output)
    //         return
    //     }
        // 继续执行
        let sql2="UPDATE vip SET vname=?,vphone=?,vip_card=?,vip_money=?,vip_people=?,sex=?,age=?,birthday=?,address=? WHERE vid=?"
    pool.query(sql2,[vname,vphone,vip_card,vip_money,vip_people,sex,age,birthday,address,vid],(err,result)=>{
         // 3.向客户端输出响应消息
         if(err){
            next(err)
            return
        }
         if (result.affectedRows == 1) {
            let output = {
                code: 200,
                msg: 'update the success',
                uid: result.insertId
            }
            console.log(result)
            
            let vip_id=req.body.vid    //cousume表 vip_id=vid
            //  let cdate=req.body.cdate      //cousume表  修改日期
            // let expent=req.query.expent      //cousume表 消费金额
             let balance=req.body.vip_money    //cousume表 余额
             console.log(vip_id)
             console.log(balance)
    
            let sql1 = "INSERT INTO consume(vip_id,cdate,balance) VALUES(?,?,?)"
             // 3.获取响应数据
            pool.query(sql1,[vip_id,new Date(),balance],(err, result) => {
                    if(err){
                    next(err)
                    return
                    }
                    // 3.向客户端输出响应消息
                    if (result.affectedRows == 1) {
                        let output = {
                            code: 200,
                            msg: 'Insert the success',
                            uid: result.insertId
                        }
                        console.log(result)
                        res.send(output)
                    } else {
                        let output = {
                            code: 404,
                            msg: 'Insert the failure'
                        }
                        res.send(output)
                    }
            })
            // res.send(output)
        } else {
            let output = {
                code: 404,
                msg: 'update the failure'
            }
            res.send(output)
        }

    // })

})
    
    
})

// 4.删除数据
// post
// /vip/delete
router.post("/delete",(req,res,next)=>{
    // 1.获取用户id
    let vid=req.body.vid
    // 2.执行sql
    let sql1="DELETE  FROM vip WHERE vid=?"
    pool.query(sql1,vid,(err,result)=>{
        if(err){
            next(err)
            return
        }
        if(result.affectedRows==1){
            let output={
                code:200,
                msg:"delete the sucess",
                uid:result.insertId
            }
            console.log(output)
            res.send(output)
        }else{
            let output = {
                code: 404,
                msg: 'delete the failure'
            }
            res.send(output)
        }
    })
})

//5.设置修改查看历史价格
router.get(`/money`, (req, res, next) => {
    //获取信息
    // let uid=req.uid    //登录中间件检查req中添加req.uid属性
    //2.执行sql
    // let vid=req.query.vid   //vip序号编号
    // let vname=req.query.vname  //vip表会员名称
    // let vip_card=req.query.vip_card  //vip表会员卡号
    // let vip_money=req.query.vip_money   //vip表充值金额
    // let cid=req.query.cid       //cousume表 cid自增
    // let vip_id=req.query.vip_id    //cousume表 vip_id=vid
    // let cdate=req.query.cdate      //cousume表  修改日期
    // let expent=req.query.expent      //cousume表 消费金额
    // let balance=req.query.balance    //cousume表 余额

    let sql2 = "SELECT vip_id,cdate,balance FROM consume WHERE cid=?"
    // 3.获取响应数据
    pool.query(sql2,cid,(err, result) => {
        if (err) {
            next(err)
            return
        }
        res.send(result)
        console.log(result)
    })
})
