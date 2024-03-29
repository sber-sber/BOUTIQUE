import express from "express";
import mysql from "mysql";
import dotenv from 'dotenv';
import cors from "cors";
import {copyData} from './microservices/queryFilter/client.js';

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

// Create a db connection
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    // password: process.env.MYSQL_PASSOWRD,
    database: process.env.MYSQL_DATABASE
  })


// **************************************
// products database routes
// **************************************
  app.get("/products", (req, res) => {
    const q = 'SELECT * FROM products'
    db.query(q, (err,data)=>{
        if(err) return res.json(err)
        return res.json(data) 
    })
})

app.get("/products/:id", (req, res) => {
    const id = req.params.id
    const query = `SELECT * FROM products WHERE id = ?`
    db.query(query, id, (err,data)=>{
        if(err) return res.json(err)
        return res.json(data) 
    })
})

app.post("/products", (req,res) => {
    const query1 = "INSERT INTO products (`name`,`description`,`category`,`price`) VALUES (?)"
    const values = [
        req.body.name,
        req.body.description,
        req.body.category,
        req.body.price,
    ];
                // const query2 = "INSERT INTO customerFacing (`name`,`description`,`price`) VALUES (?)"
                //         const values2 = [
                //             req.body.name,
                //             req.body.description,
                //             req.body.price,
                //         ];

        // FOR DEMO VIDEO: MICROSERVICE IMPLEMENTATION HERE
        const data = {
            readyForCopying: true,
            json_data: {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            },
        };
        copyData(data)

    db.query(query1,[values], (err,data) => {
        if(err) return res.json(err)
        return res.json("Product has been created successfully") 
    });

                //      db.query(query2,[values2], (err,data) => {
                //     if(err) return res.json(err)
                //     return res.json("Product has been added to customer-facing successfully") 
                // });

});


app.delete("/products/:id", (req,res) => {
    const productId = req.params.id;
    const query = "DELETE FROM products WHERE id = ?"    
    db.query(query,[productId], (err,data)=>{
        if(err) return res.json(err);
        return res.json("Product has been deleted successfully.");
    });
});

// Re: req.body vs req.params: https://stackoverflow.com/questions/24976172/node-js-req-params-vs-req-body
app.put("/products/:id", (req,res) => {
    const productId = req.params.id;
    const query = "UPDATE products SET `name` = ?, `description` = ?, `category` = ?, `price` = ? WHERE id = ?"
    const values=[
        req.body.name,
        req.body.description,
        req.body.category,
        req.body.price,
    ];
    db.query(query, [...values,productId], (err,data) => {
        if(err) return res.json(err);
        return res.json("Product has been updated successfully");
    });
});


// **************************************
// customerFacing database routes
// **************************************
app.get("/customerFacing", (req, res) => {
    const query = 'SELECT * FROM customerFacing'
    db.query(query, (err,data)=>{
        if(err) return res.json(err)
        return res.json(data) 
    })
})

// NOTE: Could be wrong
app.get("/customerFacing/:id", (req, res) => {
    const id = req.params.id
    const query = `SELECT * FROM customerFacing WHERE id = ?`
    db.query(query, id, (err,data)=>{
        if(err) return res.json(err)
        return res.json(data) 
    })
})


app.listen(8800, ()=>{
    console.log("Connected to backend!")
})
