//Installering för SQLite

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/courses.db");

db.serialize(() =>{
    db.run("DROP TABLE IF EXISTS courses");
    db.run(`
        CREATE TABLE courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coursecode VARCHAR(15) NOT NULL,
            coursename VARCHAR(50) NOT NULL,
            syllabus VARCHAR (255) NOT NULL,
            progression VARCHAR(1) NOT NULL,
            course_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
    `);
});


db.close();