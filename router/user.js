// 所有已/user开头的请求
const express = require('express')
const pool = require('../pool.js')
router = express.Router()

/**
 * 1.用户注册
 * 接口URL
 * {{url}}/user/register
 * 请求方式POST
 * 请求主体Content-Type
 * application/json
 *请求Body参数
 *参数	示例值	必填	参数描述
 * 
 * uname linbo   必填   用户名
 * uphone 13227023076  必填   手机号
 * upwd  123456  必填   密码
 * 
  *成功响应示例
 *{
 *    "code": 200,
 *    "msg": "register success",
 *    "uid": 7
 *}
 *
 */
router.post('/register',(req,res,next)=>{
	let uname=req.body.uname
	console.log(uname)
  if(!uname){
    let output={
      code:401,
      msg:'uname required'
    }
    res.send(output)
    return
  }
	let upwd=req.body.upwd
	console.log(upwd)
  if(!upwd){
    let output={
      code:402,
      msg: 'upwd required'
    }
    res.send(output)
		return
  }
	let uphone = req.body.uphone
	console.log(uphone)
	if (!uphone) {
		let output = {
			code: 403,
			msg: 'uphone required'
		}
		res.send(output)
		return
	}
  // 2.执行数据库插入操作
  let sql1='SELECT uid FROM user WHERE uname=? OR uphone=?'
  pool.query(sql1,[uname,uphone],(err,result)=>{
    if(err){
      next(err)
      return
    }
    if(result.length>0){
      //查询到相关记录
      let output={
        code:400,
        msg:'uname or uphone alredy taken'
      }
      res.send(output)
      return
    }
    // 继续执行
    let sql2="INSERT INTO user(uname,uphone,upwd) VALUES(?,?,?)"
    pool.query(sql2,[uname,uphone,upwd],(err,result)=>{
      if (err){
        next(err)
        return
      }
      // 3.向客户端输出响应消息
      if(result.affectedRows==1){
        let output = {
					code: 200,
					msg: 'Insert the success',
					uid: result.insertId
      }
      console.log(output)
        res.send(output)
     }else{
       let output={
         code:404,
         msg:'Insert the failure'
       }
       res.send(output)
     }
    })
  })
})

/**
 * 1.2	用户登录
接口URL
{{url}}/user/login
请求方式
POST
请求 Content-Type
application/json
请求Body参数
参数	示例值	必填	参数描述
uname	lisi	必填	-用户名
upwd	abc123	必填	-密码
成功响应示例
{
    "code": 200,
    "msg": "login success",
    "UserInfo": {
        "uid": 5,
        "uname": "ranran@tedu.cn",
        "nickname": "然然"    
    }
}

 */
router.post('/login', (req, res, next) => {
	// 1.读取客户端提交的请求数据
	let uname = req.body.uname
	
	console.log(uname)
	if (!uname) {
		let output = {
			code: 401,
			msg: 'not find uname'
		}
		res.send(output)
		return
	}
	let upwd = req.body.upwd
	console.log(upwd)
	if (!upwd) {
		let output = {
			code: 402,
			msg: 'not find upwd'
		}
		res.send(output)
		return
	}
	// 2.执行数据库操作
	let sql = 'SELECT uid,uname,upwd FROM user WHERE uname=? AND upwd=?'
	pool.query(sql, [uname, upwd], (err, result) => {
		if (err) {
			next(err)
			return
		}
		if (result.length > 0) {
			// 3.想客户端输出响应结果
			let output = {
				code: 200,
				msg: "login success",
				UserInfo: result[0]
			}
			req.session.userInfo = result[0]
			req.session.save() //手工保存对session数据的修改
			res.send(output)
			console.log(output.UserInfo)
			// 当前客户端保存在服务器上的session空间内存储自己的数据
			
			console.log(req.session)
			console.log(req.session.save())
			console.log(result[0])
		} else {
			let output = {
				code: 404,
				msg: 'login failure'
			}
			res.send(output)
			
		}
	})


})

/*
1.3	检测用户名是否存在
接口URL
{{url}}/user/check_uname
请求方式
GET
请求查询字符串参数
参数	示例值	必填	参数描述
uname	zhangsan	必填	-用户名
成功响应示例
{
    "code": 200,
    "msg": "exists"
}
失败响应示例
{
    "code": 401,
    "msg": "non-exists"
}

*/
router.get('/check_uname', (req, res, next) => {
	// res.send('this is check_uname...')
	// 1.读取客户端提交的请求数据
	let uname = req.query.uname
	if (!uname) {
		let output = {
			code: 400,
			msg: 'uname required'
		}
		res.send(output)
		return
	}


	// 2.执行数据库查询操作
	let sql = 'SELECT uid FROM USER WHERE uname=?'
	pool.query(sql, uname, (err, result) => {
		// if(err){ throw err}   //正式上线不能使用  error Header
		if (err) {
			next(err) //把所有的错误都交给下一个"错误处理中间件处理"
			return //手工终止当前的路由处理过程
		}

		// 3.向客户端输出相应消息
		if (result.length === 0) {
			let output = {
				code: 401,
				msg: 'non-exsits'
			}
			res.send(output)
		} else {
			let output = {
				code: 200,
				msg: 'exists'
			}
			res.send(output)
		}
	})

})


/*
	1.4	检测手机号是否存在
接口URL
{{url}}/user/check_phone
请求方式
GET
请求查询字符串参数
参数	示例值	必填	参数描述
phone	13333333333	必填	-手机号
成功响应示例
{
    "code": 200,
    "msg": "exists"
}
失败响应示例
{
    "code": 402,
    "msg": "non-exists"
}

*/
router.get('/check_uphone', (req, res, next) => {
	// res.send('this is check_phone...')
	// 1.读取客户端提交的请求数据
	let uphone = req.query.uphone
	if (!uphone) {
		let output = {
			code: 400,
			msg: 'uphone required'
		}
		res.send(output)
		return
	}


	// 2.执行数据库查询操作
	let sql = 'SELECT uid FROM USER WHERE uphone=?'
	pool.query(sql, uphone, (err, result) => {
		// if(err){ throw err}   //正式上线不能使用  error Header
		if (err) {
			next(err) //把所有的错误都交给下一个"错误处理中间件处理"
			return //手工终止当前的路由处理过程
		}

		// 3.向客户端输出相应消息
		if (result.length === 0) {
			let output = {
				code: 401,
				msg: 'non-exsits'
			}
			res.send(output)
		} else {
			let output = {
				code: 200,
				msg: 'exists'
			}
			res.send(output)
		}
	})

})




module.exports = router
