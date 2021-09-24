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

const fs = require("fs");
let employees=[];
let departments=[];

module.exports.initialize=function(){
    function storeEmp(){
        return new Promise(function(resolve, reject){
            fs.readFile('./data/employees.json', function(err, jsonString) {
                if (err) {
                    //console.log("Error reading file from disk:", err)
                    reject("unable to read file");
                    return;
                }
                try {
                    const data = JSON.parse(jsonString);
                    employees=data;
                    resolve();
            //console.log("Customer address is:", customer.address) // => "Customer address is: Infinity Loop Drive"
                } catch(err) {
                    //console.log('Error parsing JSON string:', err)
                    reject("Error parsing JSON string");
                    return;
                }
            });
        });
    }

    function storeDep(msg){
        return new Promise(function(resolve, reject){
            fs.readFile('./data/departments.json', (err, jsonString) => {
                if (err) {
                    //console.log("Error reading file from disk:", err)
                    reject("unable to read file");
                    return;
                }
                try {
                    const data = JSON.parse(jsonString);
                    departments=data;
                    resolve();
            //console.log("Customer address is:", customer.address) // => "Customer address is: Infinity Loop Drive"
                } catch(err) {
                    //console.log('Error parsing JSON string:', err)
                    reject("Error parsing JSON string");
                    return;
                }
            });
        });
    }

    storeEmp()
    .then(storeDep)
    .catch(function(rejectMsg){
        // catch any errors here
        console.log(rejectMsg);
    });
}
//initialize();

// function jsonReader(filePath, cb) {
//     fs.readFile(filePath, (err, fileData) => {
//         if (err) {
//             return cb && cb(err)
//         }
//         try {
//             const object = JSON.parse(fileData)
//             //console.log(object);
//             return cb && cb(null, object)
//         } catch(err) {
//             return cb && cb(err)
//         }
//     })
// }
// jsonReader('./data/employees.json', (err, data) => {
//     if (err) {
//         console.log(err)
//         return
//     }
//     //console.log(customer.address) // => "Infinity Loop Drive"
//     employees=data;
// })



// jsonReader('./data/departments.json', (err, data) => {
//     if (err) {
//         console.log(err)
//         return
//     }
//     //console.log(customer.address) // => "Infinity Loop Drive"
//     departments=data;
// })

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
                    //console.log(managers);
                }
            }
        }
        resolve(managers);
    })
}

module.exports.getAllDepartments = function(){
    return new Promise((resolve,reject)=>{
        if (employees.length == 0) {
            reject("no results returned"); return;
        }

        resolve(departments);
    })
}