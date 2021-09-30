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