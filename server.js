/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Boae Park      Student ID: 075194100    Date: oct 10, 2021
*
* Online (Heroku) Link: https://desolate-chamber-07691.herokuapp.com/
*
********************************************************************************/

var express=require("express");
var app=express();
const fs = require("fs");
const multer = require("multer");
var path=require("path");

const dataService = require('./data-service.js');

var HTTP_PORT=process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", (req,res)=>{
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/employees/add", (req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

app.post("/employees/add",  (req, res) => {
 
    dataService.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
      }).catch((err)=>{
        res.send(err);
    });
});


app.get("/images/add", (req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req,res)=>{
    fs.readdir("./public/images/uploaded", function(err, items) {
        res.json({"images": items}); 
    });
});

app.get("/employees", (req,res) => {
    if (req.query.status) {dataService.getEmployeesByStatus(req.query.status).then((data)=>{ res.json(data);}) }
    if (req.query.department) { dataService.getEmployeesByDepartment(req.query.department).then((data)=>{ res.json(data);})}
    if (req.query.manager) { dataService.getEmployeesByManager(req.query.manager).then((data)=>{ res.json(data);})}
    dataService.getAllMembers().then((data)=>{
        res.json(data); 
    }).catch((err)=>{
        res.send(err);
    });
});

app.get("/employee/:value", (req,res) => {
    dataService.getEmployeeByNum(req.params.value).then((data)=>{
        res.json(data); 
    }).catch((err)=>{
        res.send(err);
    });
});

app.get("/managers", (req,res) => {
    dataService.getAllManagers().then((data)=>{
        res.json(data); 
    }).catch((err)=>{
        res.send(err);
    });
});

app.get("/departments", (req,res) => {
    dataService.getAllDepartments().then((data)=>{
        res.json(data); 
    }).catch((err)=>{
        res.send(err);
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


dataService.initialize()
.then(function(){
    app.listen(HTTP_PORT, onHttpStart);
})
.catch((err)=>{
    res.send(err);    
});
