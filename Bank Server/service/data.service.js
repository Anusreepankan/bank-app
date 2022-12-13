//import model Account
const db = require('./db')

//import jsonwebtoken
const jwt = require('jsonwebtoken')


//login function
const login = (acno,pswd)=>{
    
    //check acno,pswd present in mongo db\
    //asynchronous function call
return db.Account.findOne({
    acno,
    password:pswd
}).then((result)=>{
    if(result){
   console.log("Login successful")
   
   //generate token
 const token = jwt.sign({
    currentAcno:acno
 },'secretkey55')
 
   //currentAcno
   let currentAcno=acno



   

   return{
    status:true,
    message:"login successful",
    username:result.username,
    statusCode:200,
    token,
    currentAcno
   
    
   }
    }
    else{
        console.log("Invalid account number or password")
        return{
            status:false,
            message:"Invalid account number or password",
            statusCode:404
            
           }

    }
})
}
//register
const register=(acno,pswd,uname)=>{
    console.log("inside register function definition");
    //login function
    
    //check acno,pswd present in mongo db\
    //asynchronous function call
return db.Account.findOne({
    acno
  
}).then((result)=>{
    if(result){
   console.log("Already registerd")
   return{
    status:false,
    message:"Account already exsist please login",
    statusCode:404
    
   }
    }
    else{
        console.log("Register successful")
        let newAccount= new  db.Account({
            acno,
           password:pswd,
            username:uname,
            balance:0,
            transaction:[]
        })
        newAccount.save()
        return{
            status:true,
            message:"Registration successful",
            statusCode:200
        }
    }
   
})
}
//deposit
const deposit =(req,acno,pswd,amount)=>{
    //convert string amount to nbr
    let amt= Number(amount)
    
    
        //check acno,pswd present in mongo db\
        //asynchronous function call
    return db.Account.findOne({
        acno,
        password:pswd
    }).then((result)=>{
        if(result){

            if(req.currentAcno!=acno){
                return{
                status:false,
                message:"operation denied..Allowed only own account transaction",
                statusCode:404

            }
        }
       result.balance += amt
       result.transaction.push({
        type:"CREDIT",
        amount:amt

       })


       result.save()
       return{
        status:true,
        message:`${amount} deposited successfully`,
        statusCode:200
        
       }
        }
        else{
            console.log("Invalid account number or password")
            return{
                status:false,
                message:"Invalid account number or password",
                statusCode:404
                
               }
    
        }
    })

}


//withdraw
const withdraw =(req,acno,pswd,amount)=>{
    console.log("inside withdraw function definition");
    //convert string amount to nbr
    let amt= Number(amount)
    
    
        //check acno,pswd present in mongo db\
        //asynchronous function call
    return db.Account.findOne({
        acno,
        password:pswd
    }).then((result)=>{
        if(result){

            if(req.currentAcno!=acno){
                return{
                status:false,
                message:"operation denied..Allowed only own account transaction",
                statusCode:404

            }
        }

        //chech sufficiient balnce
        if(result.balance <amt){
            //insufficient balance case
            return{
                status:false,
                message:"Transaction failed ... insufficient balance",
                statusCode:404

            }
        }


       result.balance -= amt
       result.transaction.push({
        type:"DEBIT",
        amount:amt

       })


       result.save()
       return{
        status:true,
        message:`${amount} debited successfully`,
        statusCode:200
        
       }
        }
        else{
            console.log("Invalid account number or password")
            return{
                status:false,
                message:"Invalid account number or password",
                statusCode:404
                
               }
    
        }
    })

}
//getBalance
const getBalance = (acno)=>{
    return db.Account.findOne({
        acno
    }).then(
        (result)=>{
            if(result){
                let balance = result.balance
                result.transaction.push({
                    type:"BALANCE ENQUIRY",
                    amount:'Nill'
                })
                result.save()
                return{
                    status:true,
                    statusCode:200,
                    message:`YOUR CURRENT BALANCE IS ${balance} RUPEEES` 
                }
            }
            else{
                return{
                    status:false,
                    statusCode:404,
                    message:'Invalid Account'
            
                }
            }
        }
    )
}
//get transaction
const getTransaction = (acno)=>{
    return db.Account.findOne({
        acno
    }).then(
        (result)=>{
            if(result){
                
                return{
                    status:true,
                    statusCode:200,
                    transaction:result.transaction
                }
            }
            else{
                return{
                    status:false,
                    statusCode:404,
                    message:'Invalid Account'
            
                }
            }
        }
    )
}

//deleteAccount
const deleteAccount = (acno)=>{

    return db.Account.deleteOne({
        acno
    }).then(
        (result)=>{
            if(result){
                
                return{
                    status:true,
                    statusCode:200,
                    message:"Account deleted successfully"
                }
            }
            else{
                return{
                    status:false,
                    statusCode:404,
                    message:'Invalid Account Number'
            
                }
            }
        }
    )

}




   
                 


module.exports = {
    login,
    register,
    deposit,
    withdraw,
    getBalance,
    getTransaction,
    deleteAccount 



}