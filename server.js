/****************************************************************************************************
*
*  WEB422 – Assignment 01
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Valentina Derksen    Student ID: 153803184      Date: January 17, 2020
*
*  Online (Heroku) Link: https://morning-forest-04971.herokuapp.com/
*
******************************************************************************************************/ 

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataService = require("./modules/data-service.js");

const myData = dataService("mongodb+srv://vdx345:Lena157@cluster0-ocjda.mongodb.net/sample_supplies?retryWrites=true&w=majority");

const app = express();

app.use(cors());

app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)
// to add a new "Sale"
// Return Status 201 Created
app.post("/api/sales", (req, res) => {
    myData.addNewSale(req.body)
    .then(()=>res.status(201))
    .catch((err) => res.json({"message": err}))
  })

// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: /api/sales?page=1&perPage=5 )
// to return all "Sales" objects for a specific clear"page"
// works for request http://localhost:8080/api/sales/1&5
// Return Status 200 OK 
// or Status 404 Not Found
app.get("/api/sales/:page&:perPage", (req, res) => {
    myData.getAllSales(req.params.page, req.params.perPage)
    .then((data)=> 
    {if(data.length<0)
      res.status(404).json({"message": "Resource not found" });
      else res.status(200).json(data)
    })
    .catch((err)=>res.status(404).json({"message": "Resource not found" }));
})

// works for request http://localhost:8080/api/sales?page=1&perPage=5
// Return Status 200 OK 
// or Status 404 Not Found
app.get("/api/sales", (req, res) => {
    myData.getAllSales(req.query.page,req.query.perPage)
    .then((data)=> 
    { if(data.length<0)
      res.status(404).json({"message": "Resource not found" });
      else res.status(200).json(data)
    })
    .catch((err)=>res.status(404).json({"message": "Resource not found" }));
})

// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
// To get one sale by id
// Return Status 200 OK 
// or Status 404 Not Found
app.get("/api/sales/:id", (req, res) => {
    myData.getSaleById(req.params.id)
    .then((data)=>{
        if(data.length<0)
        res.status(404).json({"message": "Resource not found" });
        else res.status(200).json(data)
    })   
    .catch((err)=>res.status(404).json({"message": "Resource not found" }));
})

// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)
// To update sale by id
// Return Status 200 OK 
// or Status 404 Not Found
app.put("/api/sales/:id", (req, res) => {
    myData.updateSaleById(req.body, req.params.id)
    .then((data)=>res.status(200).json(data))
    .catch((err)=>res.status(404).json({ "message": "Resource not found" }))
})

// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
// Return HTTP 204 No Content 
  app.delete("/api/sales/:id", (req, res) => {
    myData.deleteSaleById(req.params.id)
    .then(()=>res.status(204).end())
    .catch((err) => res.json({"message": err}))
  })

// ************* Initialize the Service & Start the Server

myData.initialize().then(()=>{
    app.listen(HTTP_PORT,()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

