const express = require("express");
const bodyParser = require("body-parser"); //Möjlighet att läsa in form-data
const app = express();
const port = 3000;

//Databas
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/courses.db");

app.set("view engine", "ejs");    //View engine: EJS
app.use(express.static("public")); //Statiska filer i katalog "public"
app.use(bodyParser.urlencoded({extended: true})); //Ta emot form-data

//Route, där användaren hamnar
app.get("/", (req, res) =>{
    res.render("index", {
        fullname: "Vera Kippel"
    }); //Vilken vy vi vill rendera
});

app.get("/courses", (req, res) =>{
    db.all("SELECT * FROM courses ORDER BY id DESC;", (err, rows) =>{
        if(err){
            console.error(err.message);
        }
        res.render("courses", { //Vilken vy vi vill rendera
            error: "",
            rows: rows
        });
    });
});

app.get("/courses/add", (req, res) => {
    res.render("addcourses", {
        errors: [],
        newCode: "",
        newName: "",
        newSyllabus: "",
        newProgression: ""
    });
});

app.post("/courses/add", (req, res) => {
    //Läs in formulär-data
    let newCode = req.body.code;
    let newName = req.body.name;
    let newSyllabus = req.body.syllabus;
    let newProgression = req.body.progression;

    let errors = [];

    //Validera input
    if(newCode === ""){
        errors.push("Ange en korrekt kurskod!");
    }
    if(newName === ""){
        errors.push("Ange ett korrekt namn!");
    }
    if(newSyllabus === ""){
        errors.push("Ange en korrekt syllabus!");
    }
    //Gör en array för godkända progressioner för att kunna kolla progressions-värdet som skrivits in
    let correctProg = ["A", "B", "C"];
    if(!correctProg.includes(newProgression.trim().toUpperCase())){ //Gör input till uppercase för att kunna hantera gemener
        errors.push("Ange en korrekt progression (A, B eller C)!");
    }
    
    //Lägg till ny kurs
    //Validering för korrekt ifyllt
    if(errors.length === 0){
        const stmt = db.prepare("INSERT INTO courses(coursecode, coursename, syllabus, progression)VALUES(?, ?, ?, ?);");
        stmt.run(newCode, newName, newSyllabus, newProgression);
        stmt.finalize();

        //Redirect till kurssida
        res.redirect("/courses");
    }else{
        res.render("addcourses", {
            errors: errors,
            newCode: newCode,
            newName: newName,
            newSyllabus: newSyllabus,
            newProgression: newProgression
        });
    }
});

app.get("/delete/:id", (req, res) =>{
    let id = req.params.id;

    //Radera kurs
    db.run("DELETE FROM courses WHERE id=?;", id, (err) =>{
        if(err){
            console.error(err.message);
        }
        //Skickar användare till kurs-sida
        res.redirect("/courses");
    });
});

app.get("/edit/:id", (req, res) =>{
    let id = req.params.id;
    db.get("SELECT * FROM courses WHERE id=?;", id, (err, row) =>{
        if(err){
            console.error(err.message);
        }
        res.render("edit", {
            row: row,
            errors: ""
        });
    });
});

app.post("/edit/:id", (req, res) =>{
    //Läs in formulär-data
    let id = req.params.id;
    let newCode = req.body.code;
    let newName = req.body.name;
    let newSyllabus = req.body.syllabus;
    let newProgression = req.body.progression;

    let errors = [];

    //Validera input
    if(newCode === ""){
        errors.push("Ange en korrekt kurskod!");
    }
    if(newName === ""){
        errors.push("Ange ett korrekt namn!");
    }
    if(newSyllabus === ""){
        errors.push("Ange en korrekt syllabus!");
    }
    let correctProg = ["A", "B", "C"];
    if(!correctProg.includes(newProgression.trim().toUpperCase())){
        errors.push("Ange en korrekt progression (A, B eller C)!");
    }
    
    if(errors.length === 0){
        const stmt = db.prepare("UPDATE courses SET coursecode=?, coursename=?, syllabus=?, progression=? WHERE id=?;");
        stmt.run(newCode, newName, newSyllabus, newProgression, id);
        stmt.finalize();

        res.redirect("/courses");
    }else{
        res.render("edit", {
            errors: errors,
            row: {
            newCode: newCode,
            newName: newName,
            newSyllabus: newSyllabus,
            newProgression: newProgression
            }
        });
    }
});

app.get("/about", (req, res) =>{
    res.render("about"); //Vilken vy vi vill rendera
});

//Starta app
app.listen(port, () => {
    console.log("Servern startad på port: " + port);
});