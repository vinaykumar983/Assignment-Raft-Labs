const exp = require("express")
const app = exp()
app.use(exp.json());
const mclient=require("mongodb").MongoClient;

const DBurl='mongodb+srv://vinaykumar20:vinaykumar20@mycluster.hgq5f.mongodb.net/'

mclient.connect(DBurl)
.then((obj)=>{
    let dbobj=obj.db("raft-labs");
    let userCollectionObj=dbobj.collection("users");
    app.set("userCollectionObj",userCollectionObj);
    console.log("DB connection success");
})
.catch((err)=>{
    console.log("Error in DB connection",err);
})

const {userApp}=require('./API/userApp.js');
app.use('/users',userApp);
app.use((request,response,next)=>{
    response.send({message:"Path is invalid"});
})

app.use((error,request,response,next)=>{
    response.send({message:"Invalid syntax"});
})

app.listen(4000,()=>{
    console.log("server is running on port 4000");
})

