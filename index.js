// Node.js+Express服务器端应用
const express=require("express")

let port=5050  //新浪云中node.js中只允许端口为5050
let app=express()  //创建web服务器

//设置端口号并启动web服务器
app.listen(port,()=>{
  console.log('Server Listening on PORT：'+port)
})

/*一、请求正式处理前的"前置中间件"*/
// 1.请求主体的处理中间件
let bodyParser = require('body-parser')
app.use(bodyParser.json()) //处理请求主体中的JSON数据，保存到req.body属性中
// 2.CORS跨域处理中间件
let cors = require('cors')
app.use(cors({ //设置运行客户端跨域请求相关的响应消息头部 —— TODO：此处未完结
	origin: ['http://127.0.0.1:8080', 'http://localhost:8080','http://192.168.0.109:8080','http://192.168.0.109:8081','http://127.0.0.1:5050',],
	// 修改Access-Control-Allow-Credentials:true——运行客户端请求携带身份认证
	credentials: true,
}))
// 3.处理客户端上传文件的中间件
// 4.服务器端session处理中间件
let session = require('express-session')
app.use(session({
	secret: 'xuanshangsecret123', //指定生成sid所用的加密秘钥——随机数种子
	saveUninitialized: true, //是否保存未初始化的session数据
	resave: true //是否重新保存session数据  
}))

/*二、处理请求路由&路由器*/
// 1.处理所有以/user开头的请求的路由器 
const userRouter = require('./router/user.js')
app.use('/user', userRouter)
// 2.处理所有以/login开头的请求的路由器
// 路由中间件 在会员相关路由执行之前进行登录检查
// const loginCheckMiddleware = require('./middleware/loginCheck.js')
// app.use('/vip', loginCheckMiddleware)
//处理所有以/vip开头的请求的路由器
const vipRouter = require('./router/vip.js')
app.use('/vip', vipRouter)
// 3.处理所有以/consume开头的请求的路由器
// 路由中间件 在购物车相关路由执行之前进行登录检查
// app.use('/consume', loginCheckMiddleware)
const consumeRouter = require('./router/consume.js')
app.use('/consume', consumeRouter)


/*三、请求处理完成后的"后置中间件"*/
// 1.日志记录中间件
//app.use((req, res, next)=>{
//   把此次操作执行的内容保存到一个日志文件中
//   next()
//})

// 2.异常处理中间件 —— 处理路由执行过程中出现的所有错误
app.use((err, req, res, next) => { //第一个形参是err的中间件就是“错误处理中间件”
	res.status(500) //修改响应消息状态码
	let output = {
		code: 500,
		msg: 'Error occoured during server running',
		err: err
	}
	res.send(output)
})

