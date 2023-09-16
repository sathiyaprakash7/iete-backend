const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const nodemailer = require("nodemailer");

var app = express();

app.use(express.json());
app.use(cors());

var con = mysql.createConnection({
    host:"sql12.freemysqlhosting.net",
    user:"sql12646903",
    password:"XI86Y3WbLa",
    database:"sql12646903"
});

con.connect();

const mailConfig = {
    service:"gmail",
    host:"smtp.gmail.com",
    port:"587",
    secure:true,
    auth:{
        user:"sathiyaprakash@aucet.in",
        pass:"eovxbrvelrgbvrhs"
    }
};

app.get("/", (req,res)=>{
    let qry = "select * from contact";
    con.query(qry,(err, data)=>{
        if (err) {
            console.error("error occur when executing query");
        }
        res.send(data);
    })
});

app.post("/add", (req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    con.query("insert into contact (name,email,message) values (?,?,?)",
    [name,email,message],
    (err,data)=>{
        if(err){console.error(err);}
        else{
        res.send("data inserted success");
        }
    })
});

const sendMail = (mailData)=>{
    const transporter = nodemailer.createTransport(mailConfig);
    transporter.sendMail(mailData, (err,done)=>{
        if (err){console.log(err);}
        else {return done.response;}
    })
}


app.post("/sendmail", async (req, res)=>{
    const from = "sathiyaprakash@aucet.in";
    const to = "sathiyaprakash@aucet.in";
    const {name,email,message} = req.body;
    const subject = `${name} send from IETE contact form`;
    const html = `<table>`+
    `<tr><td><b>Name:</b></td><td>${name}</td></tr>`+
    `<tr><td><b>Email:</b></td><td>${email}</td></tr>`+
    `<tr><td><b>Message:</b></td><td>${message}</td></tr>`+
    `</table>`;
    const data = {from,to,subject,html};
    const mailRes = await sendMail(data);
    res.send(mailRes);
})

app.listen(1234, ()=>{
    console.log("App starts at port 1234");
})
