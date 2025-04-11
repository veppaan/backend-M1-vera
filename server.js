const express = require("express");
const bodyParser = require("body-parser"); //Möjlighet att läsa in form-data
const app = express();
const port = 3000;

//Databas
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/cv.db");

app.set("view engine", "ejs");    //View engine: EJS
app.use(express.static("public")); //Statiska filer i katalog "public"
app.use(bodyParser.urlencoded({extended: true})); //Ta emot form-data