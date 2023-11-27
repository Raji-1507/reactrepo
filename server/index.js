require('dotenv').config();
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserModel = require("./models/users")
const Todo = require("./models/todo")
const category  = require("./models/category")
 const Token = require("./models/token");
 const SendEmail = require("./SendEmail");
 const crypto = require("crypto");
const app = express()
app.use(express.json())
app.use(cors())
mongoose.connect("mongodb://localhost:27017/TODO")

app.post('/register',async (req,res) =>{
    
    // UserModel.create(req.body)
    // .then(users=>res.json(users))
    // .catch(err=>res.json(err))
    try{
        let user = await UserModel.findOne({email:req.body.email})
        if(user){
            return res.status(409).send({message:"User with given email already exist!"});
        }
        user = await new UserModel({...req.body,verified:false}).save();
        const token = await new Token({
            userId:user._id,
            token:crypto.randomBytes(32).toString("hex")

        }).save();
        const url = `${process.env.BASE_URL}${user._id}/verify/${token.token}`;
        await SendEmail(user.email,"Verify Email",url);
        res.status(201).send({message:"An Email sent to your account please verify"});
    }catch(error){
        res.status(500).send({message:"Internal Server Error"});
    }
});
app.get("/:id/verify/:token",async(req,res)=>{
    try{
        const user = await UserModel.findOne({_id:req.params.id});
        if(!user){
            return res.status(400).send({message:"Invalid link"});
            
        }
        const token = await Token.findOne({
            userId:user._id,
            token : req.params.token
        });
        if(!token){
            return res.status(400).send({message:"Invalid link"});

        }
        await UserModel.updateOne({_id:user._id,verified:true});
        
        res.status(200).send({message:"Email verifyed successfylly"});
    }
    catch(error){
        res.status(500).send({message:"Internal Server Error"});
    }
});
app.post('/login',async (req,res) =>{
    const { email, password } = req.body;
    const user = await UserModel.findOne({email:email})
    try{
        if(user){
            if (!user.verified) {
                let token = await Token.findOne({ userId: user._id });
                if (!token) {
                    token = await new Token({
                        userId: user._id,
                        token: crypto.randomBytes(32).toString("hex"),
                    }).save();
                    const url = `${process.env.BASE_URL}${user.id}/verify/${token.token}`;
                    await SendEmail(user.email, "Verify Email", url);
                }
    
                return res
                    .status(400)
                    .send({ message: "An Email sent to your account please verify" });
            }else{
    
                if(user.password == password){
                    return res.status(200).send({user:user._id})

                }else{
                    return res.status(400).send({message:"Password is wrong"})
                }
            }
        }else{
            res.json("No records found")

        }
    }catch(error){
        res.status(500).send({message:"Internal server error"})
    }
    
})
// app.post('/todo',async (req,res)=>{
//     try{
//     const {userId,category,title, description } = req.body;
//     user = await new Todo({userId:userId,categoryId:category._id,title:title,description:description,createdAt:Date.now(),isCompleted:false}).save();
//     if(user){
//         return res.status(200)
//                     .send({ message: "Todo is created successfully" });
//     }else{
//         return res.status(400)
//                     .send({ message: "Something went wrong! Unable to create todo" });
//     }
//     }catch(error){
//         return  res.status(500)
//                     .send({ message: "internal server error" });
//     }

// });
app.post("/category",async (req,res) =>{
    const {userId,newCategory} = req.body
    try{
        await new category({userId:userId,title:newCategory }).save();
        return res.status(200)
                    .send({ message: "New Category is  created successfully" });

    }catch(error){
        return  res.status(500)
                    .send({ message: "internal server error" });
    }

})
app.post("/todo",async (req,res) =>{
    
    const {userId,category,title,description} = req.body
    try{
        await new Todo({userId:userId,categoryId:category._id,title:title,description:description,createdAt:Date.now(),isCompleted:false}).save();
        return res.status(200)
                    .send({ message: "New Todo is  created successfully" });

    }catch(error){
        return  res.status(500)
                    .send({ message: "internal server error" });
    }

})
app.put('/:userId/:todoId',async (req,res)=>{
    try{
    
    const todo = await Todo.findOne({_id:req.params.todoId,userId:req.params.userId});
    
    
        if(!todo){
            return res.status(400).send({message:"Todo not found"});

        }
        todo.isCompleted = true;
        todo.save()
        // await Todo.updateOne(todo);
        
        res.status(200).send({message:"todo updates successfully"});
    }
    catch(error){
        res.status(500).send({message:"Internal server error"});
    }
})
app.get('/todo/:userId',async (req,res) =>{
    try{
        const todos =  await Todo.find({userId:req.params.userId,isCompleted:false});
        if(todos){
            return res.status(200).send({list:todos})
        }else{
            return res.status(200).send({list:[]})
        }
    }catch(error){
        res.status(500).send({message:"Internal server error"});
    }
})

app.get('/category/:userId',async (req,res) =>{
    try{
        const categories =  await category.find({userId:req.params.userId});
        if(categories){
            return res.status(200).send({list:categories})
        }else{
            return res.status(200).send({list:[]})
        }
    }catch(error){
        res.status(500).send({message:"Internal server error"});
    }
})
// app.get('/todo/:userId',async (req,res) =>{
//     try{
//         const todos=  await Todo.find({userId:req.params.userId,isCompleted:false});
//         if(todos){
//             return res.status(200).send({list:todos})
//         }else{
//             return res.status(200).send({list:[]})
//         }
//     }catch(error){
//         res.status(500).send({message:"Internal server error"});
//     }
// })
app.get('/:userId/completed',async (req,res) =>{
    try{
        const completedTodos =  await await Todo.find({userId:req.params.userId,isCompleted:true});
        if(completedTodos){
            return res.status(200).send({list:completedTodos})
        }else{
            return res.status(200).send({list:[]})
        }
    }catch(error){
        res.status(500).send({message:"Internal server error"});
    }
})
app.listen(3001,()=>{
    console.log("Server is running")
})