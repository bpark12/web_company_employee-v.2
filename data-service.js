const e = require("express");
const fs = require("fs");
let employees=[];
let departments=[];

module.exports.initialize=function(){
    return new Promise((resolve, reject)=>{
        fs.readFile('./data/employees.json', 'utf-8', (err, data)=>{
            if(err) reject("unable to read file");
            else{
                const emData = JSON.parse(data);
                employees=emData;
                fs.readFile('./data/departments.json', 'utf-8', (err, data)=>{
                    if(err) reject("unable to read file");
                    else{
                        const depData = JSON.parse(data);
                        departments=depData;
                        resolve();
                    }
                });
            }
        });
    });
}

module.exports.getAllMembers = function(){
    return new Promise((resolve,reject)=>{
        if (employees.length == 0) {
            reject("no results returned"); return;
        }

        resolve(employees);
    })
}

module.exports.getAllManagers = function(){
    let managers=[];
    return new Promise((resolve,reject)=>{
        if (employees.length == 0) {
            reject("no results returned");
        }
        else
        {
            for(let i=0; i<employees.length; i++)
            {
                if(employees[i].isManager==true)
                {
                    managers.push(employees[i]);
                }
            }
            if(managers.length == 0)
            {
                    reject("no results returned"); 
            }
            else
            resolve(managers);
        }
    })
}

module.exports.getAllDepartments = function(){
    return new Promise((resolve,reject)=>{
        if (departments.length == 0) {
            reject("no results returned"); return;
        }
        resolve(departments);
    })
}

module.exports.addEmployee = function(employeeData){
    return new Promise((resolve,reject)=>{
        if(!employeeData){
           reject("no results returned");
        }
        else {
           
            if (employeeData.isManager==undefined) {
                    employeeData.isManager=false;
                }
            else {
                    employeeData.isManager=true;
                }
            
            employeeData.employeeNum=employees.length+1;
            employees.push(employeeData);
            resolve();
        }
    })
}

module.exports.getEmployeesByStatus = function(status){
    let empTemp=[];
    return new Promise((resolve,reject)=>{
        if (employees.length == 0) {
            reject("no results returned");
        }
        else
        {
            for(let i=0; i<employees.length; i++)
            {
                if(employees[i].status==status)
                {
                    empTemp.push(employees[i]);
                }
            }
            if(empTemp.length == 0)
            {
                    reject("no results returned"); 
            }
            else
            resolve(empTemp);
        }
    })
}

module.exports.getEmployeesByDepartment = function(department){
    let empTemp=[];
    return new Promise((resolve,reject)=>{
        if (employees.length == 0) {
            reject("no results returned");
        }
        else
        {
            for(let i=0; i<employees.length; i++)
            {
                if(employees[i].department==department)
                {
                    empTemp.push(employees[i]);
                }
            }
            if(empTemp.length == 0)
            {
                    reject("no results returned"); 
            }
            else
            resolve(empTemp);
        }
    })
}

module.exports.getEmployeesByManager = function(manager){
    let empTemp=[];
    return new Promise((resolve,reject)=>{
        if (employees.length == 0) {
            reject("no results returned");
        }
        else
        {
            for(let i=0; i<employees.length; i++)
            {
                if(employees[i].employeeManagerNum==manager)
                {
                    empTemp.push(employees[i]);
                }
            }
            if(empTemp.length == 0)
            {
                    reject("no results returned"); 
            }
            else
            resolve(empTemp);
        }
    })
}

module.exports.getEmployeeByNum = function(num){
    let empTemp;
    return new Promise((resolve,reject)=>{
        if (employees.length == 0) {
            reject("no results returned");
        }
        else
        {
            for(let i=0; i<employees.length; i++)
            {
                if(employees[i].employeeNum==num)
                {
                    empTemp=employees[i];
                }
            }
            if(!empTemp)
            {
                    reject("no results returned"); 
            }
            else
            resolve(empTemp);
        }
    })
}

module.exports.updateEmployee = function(employeeData){
    return new Promise((resolve,reject)=>{
        if (employees.length == 0) {
            reject("no results returned");
        }
        else
        {
            for(let i=0; i<employees.length; i++)
            {
                if(employees[i].employeeNum==employeeData.employeeNum)
                {
                    employees[i]=employeeData;
                    resolve();
                }
            }
        }
    })
}