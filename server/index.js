const express=require("express");
 const mongoose=require("mongoose");
 const cors=require("cors");
 const dns=require("dns");

 const app=express();

 app.use(cors());

 dbURL="mongodb+srv://shriharisadhu:Hariharan1972@quicknotesdb.ml15xmv.mongodb.net/ipconfig?retryWrites=true&w=majority&appName=quicknotesdb"

 mongoose.connect(dbURL)
 .then(()=>console.log("connected to DB"));

 const schema=mongoose.Schema({
   name:String,
   ip:String

 },{collection:"dns"});


 const lookup=mongoose.model("DNS",schema);

 async function look(domain){
 try{
 const results=await lookup.findOne({name:{$eq:domain}});
 console.log(results);
 return results;

 }
 catch(err){
    console.log("error");
    return [];
 }
 }


 async function revlook(ip){
 const results=await lookup.findOne({ip:{$eq:ip}});
 console.log(results);
 return results;

 }

 app.get('/',(req,res)=>{
    res.send("hello bhai");
 })



 app.get('/lookup', async (req, res) => {
   const domain = req.query.domain;
   const ip = req.query.ip;

   
   if (domain) {
       const result = await look(domain);
       if (result) {
           console.log("results");
           return res.json(result); 
       }

    
       dns.lookup(domain, (err, address) => {
           if (err) {
               return res.status(404).json({ status: "doesn't exist" });
           }
           console.log(address);
           return res.json({ip:address});
       });
       
      
   } 
   
   else if (ip) {
       const result = await revlook(ip);
       if (result) {
           console.log("results");
           return res.send(result); 
       } 
       dns.reverse(ip,(err,hostname)=>{
         if(err) return res.status(404).json({ status: "doesn't exist" });
         console.log(hostname);
         return res.json({domain:hostname});
       });
       
   } 
   
});



  app.listen(3000,()=>{
    console.log("listening"); 
 })