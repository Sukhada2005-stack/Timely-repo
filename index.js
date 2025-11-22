import express from 'express';
import { url } from 'inspector';
import bodyParser from 'body-parser';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = path.join(__dirname,'public','Sukhada_Resume_File (1).pdf'); 
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get("/",(req,res)=>{
     res.render("index.ejs");
});

app.get("/contact",(req,res)=>{
  res.render("contact.ejs");
});

app.post("/download",(req,res)=>{
  res.download(__filename,'Sukhada_Resume_File (1).pdf',(err)=>{
    if(err) 
    {
      console.log("Error Downloading this file: ",err);
      res.status(500).send("Could not download the resume.");
    }  
  });
});
//fetching the data from the contact form.
app.post("/send",async (req,res)=>{
    const{fname , lname , email , Subject , message} = req.body;
    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth : {
        user:process.env.USER_EMAIL,
        pass :process.env.USER_PASS, 
      },
    });
    const mailobject = {
      from : email ,
      to : "sukhadabhalerao2005@gmail.com",
      subject : Subject,
      text : "Message from "+fname+" "+lname+"("+email+")"+" :\n\n"+message+" ",
    }
    try{
      await transporter.sendMail(mailobject);
      res.status(200).send("Email Sent successfully!");
    }catch(error)
    {
      console.log(error)
      res.status(500).send("Error sending Email.");
    }
});

app.get("/linkedIn",(req,res)=>{
     res.redirect('https://www.linkedin.com/in/sukhada-bhalerao-7339a2340');
});

app.get("/projects",(req,res)=>{
  res.render("projects.ejs");
});

app.listen(port,()=>{
  console.log("The server is listening on port "+port);
});