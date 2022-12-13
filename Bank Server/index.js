//using express create server

//1.import express
const express = require('express')
//import data service
const dataservice = require('./service/data.service')
//import cors
const cors = require('cors')

//import jsonwebtoken
const jwt = require('jsonwebtoken')


//2. create server app
const app = express()
//uing cors defibe oring
app.use(cors({
    origin:['http://localhost:4200']
}))



//parse json data
app.use(express.json())

//3.set-up port for sever
app.listen(3010,()=>{
    console.log('Server started at  port 3000');


})
//application specific middleware
const appMiddleware = (req,res,next)=>{
    console.log('This is application specific middle ware');
    next()
}
app.use(appMiddleware)

//router specific middleware -token validation


//http request 
app.get('/',(req,res)=>{
    res.send('Get method')
})

app.post('/',(req,res)=>{
    res.send('Post method')
})

app.delete('/',(req,res)=>{
    res.send('Delete method')
})

app.put('/',(req,res)=>{
    res.send('Put method')
})
//router specific middleware to token validation
const jwtMiddleware =(req,res,next)=>{
    console.log('Inside  router specific middleware');
    //get token from request headers x-access-token key
    let token = req.headers['x-access-token']
//    console.log(token);
//verify token using jsonwebtoken
try{
    let data= jwt.verify(token,'secretkey55')
req.currentAcno = data.currentAcno
next()
}
catch{
    res.status(404).json({
        status:false,
        message:" Token Authentication failed Please Login"
    })
}
}
//http request -rest api- bank api



//.login api
app.post('/login',(req,res)=>{
    console.log("inside login function");
    console.log(req.body);
    //asynchronous
    dataservice.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
}),
//.Register api
app.post('/register',(req,res)=>{
    console.log("inside register function");
    console.log(req.body);
    //asynchronous
    dataservice.register(req.body.acno,req.body.pswd,req.body.uname)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
}),
//.deposit api
app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log("inside deposit function");
    console.log(req.body);
    //asynchronous
    dataservice.deposit(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
}),

//.withdraw api
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    console.log("inside withdraw function");
    console.log(req.body);
    //asynchronous
    dataservice.withdraw(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    });
    
}),


//balance api
app.post('/getBalance',jwtMiddleware,(req,res)=>{
    console.log("inside getbalance function");
    console.log(req.body);
    //asynchronous
    dataservice.getBalance(req.body.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    });
    
}),

//transaction api
app.post('/getTransaction',jwtMiddleware,(req,res)=>{
    console.log("inside getbalance function");
    console.log(req.body);
    //asynchronous
    dataservice.getTransaction(req.body.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    });
    
}),

//delete api
app.delete('/deleteAccount/:acno',jwtMiddleware,(req,res)=>{
    console.log("inside deleteAccount function");
   
    //asynchronous
    dataservice.deleteAccount(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    });
    
})

