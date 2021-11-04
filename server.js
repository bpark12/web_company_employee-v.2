/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Boae Park      Student ID: 075194100    Date: Nov 3, 2021
*
* Online (Heroku) Link: https://desolate-chamber-07691.herokuapp.com/
*
********************************************************************************/

var express=require("express");
const exphbs = require('express-handlebars')
const fs = require("fs");
const multer = require("multer");
var path=require("path");
var app=express();

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

app.engine('.hbs', exphbs({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    helpers: { 
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));

app.use(function(req, res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
    });

app.get("/", (req,res)=>{
    res.render("home")
});

app.get("/about", (req,res)=>{
    res.render("about")
});

app.get("/employees/add", (req,res)=>{
    res.render("addEmployee")
});

app.post("/employees/add",  (req, res) => {
 
    dataService.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
      }).catch((err)=>{
        res.send(err);
    });
});


app.get("/images/add", (req,res)=>{
    res.render("addImage")
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req,res)=>{
    fs.readdir("./public/images/uploaded", function(err, items) {
        res.render('images',  {images: items}); 
    });
});

app.get("/employees", (req,res) => {
    if (req.query.status) {dataService.getEmployeesByStatus(req.query.status).then((data)=>{ res.render("employees",
    {employees: data});})}
    else if (req.query.department) { dataService.getEmployeesByDepartment(req.query.department).then((data)=>{ res.render("employees",
    {employees: data});})}
    else if (req.query.manager) { dataService.getEmployeesByManager(req.query.manager).then((data)=>{ res.render("employees",
    {employees: data});})}
    else{
        dataService.getAllMembers().then((data)=>{
            res.render("employees", {employees: data}); 
        }).catch((err)=>{
            res.render("employees", {message: "no results"});
        });
    }   
});

app.get("/employee/:value", (req,res) => {
    dataService.getEmployeeByNum(req.params.value).then((data)=>{
        res.render("employee", { employee: data });
    }).catch((err)=>{
        res.render("employee",{message:"no results"});
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
        res.render("departments", {departments: data});
    }).catch((err)=>{
        res.send(err);
    });
});


app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body).then(()=>{
        res.redirect("/employees");
    }).catch((err)=>{
        res.render("employee",{message:"no results"});
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
