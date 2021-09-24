/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Boae Park      Student ID: 075194100    Date: Sep 23, 2021
*
* Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/

var express=require("express");
var app=express();
var path=require("path");

const dataService = require('./data-service.js');

var HTTP_PORT=process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/employees", (req,res) => {
    dataService.getAllMembers().then((data)=>{
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

// storeEmp()
//     .then(storeDep)
//     .catch(function(rejectMsg){
//         // catch any errors here
//         console.log(rejectMsg);
//     });

    // dataService.initialize().then((data)=>{
    //     app.listen(HTTP_PORT, onHttpStart);
    // }).catch((err)=>{
    //     res.send(err);    
    // });
dataService.initialize();
app.listen(HTTP_PORT, onHttpStart);