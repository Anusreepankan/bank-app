
//connection between sever and mongo db
//1.import mongoose
const mongoose =require('mongoose')

//2.define connection string
mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('mongodb conneceted successfully');
})

//3.create model
const Account = mongoose.model('Account',{
    acno:Number,
    password:String,
    username:String,
    balance:Number,
    transaction:[]
})

//exporting model
module.exports ={
    Account
}