const exp=require("express");
const userApp=exp.Router();
const expressAsyncHandler=require("express-async-handler");
const bcryptjs=require("bcryptjs");

userApp.get("/get-users",expressAsyncHandler(async(request,response)=>{
    let userCollectionObj=request.app.get("userCollectionObj");
    let users=await userCollectionObj.find().toArray();
    response.send({message:"All users",payload:users});
}))

userApp.get("/get-user/:id",expressAsyncHandler(async(request,response)=>{
    let userCollectionObj=request.app.get("userCollectionObj");
    let u_id=request.params.id;
    
    let user=await userCollectionObj.findOne({id:u_id});
    
    if(user!=undefined){
        response.send({message:"User found",payload:user});
    }
    else{
         response.send({message:"User not found"});
     }
}))

userApp.post("/create-user",expressAsyncHandler(async(request,response)=>{
    let user=request.body;
    let userCollectionObj=request.app.get("userCollectionObj");
    let availableUser=await userCollectionObj.findOne({username : user.username});
    if(availableUser!==null){
        response.send({message:"Please choose another username"});
    }
    else{
        let hashedPassword=await bcryptjs.hash(user.password,5);
        user.password=hashedPassword;
        await userCollectionObj.insertOne(user);
        response.send({message:"User created successfully"});
    }
}))

userApp.delete("/delete-user/:id",expressAsyncHandler(async(request,response)=>{
    let userCollectionObj=request.app.get("userCollectionObj");
    let u_id=request.params.id;
    await userCollectionObj.deleteOne({id:u_id});
    response.send({message:"Data deleted successfully"});
}));

userApp.put("/update-user/:id",expressAsyncHandler(async(request,response)=>{
    let userCollectionObj=request.app.get("userCollectionObj");
    let u_id=request.params.id;
    let new_address=request.body;
    let user=await userCollectionObj.findOne({id:u_id});
    if(user!=undefined){
        await userCollectionObj.updateOne({id:u_id},{$set:{address:new_address}});
        response.send({message:"User Updated"});
    }
    else{
         response.send({message:"User not found"});
     }
    
}))

module.exports={userApp};