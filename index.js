const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

app.use(express.json());

// craete connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vandana@1',
    database: 'blog'
})

connection.connect((err) => {
    if (err) throw err;
    console.log("database has connected......")
})

// tables for students
// var sql = "CREATE TABLE IF NOT EXISTS students (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), class VARCHAR(255));";
// connection.query(sql, (err, result) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("table has created......")
//     }
// })


var sql = "CREATE TABLE IF NOT EXISTS students (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), class VARCHAR(255), stream VARCHAR(255));";
connection.query(sql, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("table has created......")
    }
})



// table for teachers
// var sql1 = "CREATE TABLE IF NOT EXISTS teachers (id INT AUTO_INCREMENT PRIMARY KEY, teacherName VARCHAR(255), email VARCHAR(255), password VARCHAR(255), class VARCHAR(255));";
// connection.query(sql1, (err, result) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("table has created......")
//     }
// })


var sql1 = "CREATE TABLE IF NOT EXISTS teachers (id INT AUTO_INCREMENT PRIMARY KEY, teacherName VARCHAR(255), email VARCHAR(255), password VARCHAR(255), class VARCHAR(255), stream VARCHAR(255));";
connection.query(sql1, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("table has created......")
    }
})

// registation for students;
app.post("/registation", async (req, res) => {
    const saltRound = 10;
    const password = req.body.password;
    const encryptedPassword = await bcrypt.hash(password, saltRound);
    console.log(encryptedPassword);

    let body = req.body;
    let students = {
        name: body.name,
        email: body.email,
        password: encryptedPassword,
        class: body.class,
        stream: body.stream
    }
    console.log(students)
    connection.query("select email from students WHERE email = '" + req.body.email + "'", (err, result, field) => {
        if (result.length == 0) {
            let sql = "INSERT INTO students SET ?";
            let query = connection.query(sql, students, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("you have register successfully");
                }
            })
            res.json({
                message: "you have register successfully"
            })

        } else {
            console.log("you have register already please login your account")
            res.json({
                message: "you have register already please login your account"
            })
        }

    })
})

// login for students

app.post("/loginStudent", (req, res) => {
    let body = req.body;
    let students = {
        email: body.email,
        password: body.password
    }
    console.log(students);
    connection.query("select * from students WHERE email = '" + req.body.email + "'", async (err, result, field) => {
        if (err) {
            console.log(err);
            res.json({
                "failed": "error occur"
            })
        } else {
            if (result.length > 0) {
                let comparePassword = await bcrypt.compare(req.body.password, result[0].password);
                if (comparePassword) {
                    console.log("you have login successfully.......");
                    res.json({
                        message: "you have login successfully......."
                    })
                } else {
                    console.log("your password does not match");
                    res.json({
                        message: "your password does not match"
                    });
                }
            } else {
                console.log("your email does not exists");
                res.json({
                    message: "your email does not exists"
                })
            }
        }
    })


})


// registation for teachers
app.post("/registationForTeachers", async (req, res) => {
    const salt_Round = 10;
    const password = req.body.password;
    const encrypted_Password = await bcrypt.hash(password, salt_Round);
    console.log(encrypted_Password);

    let body = req.body;
    let teachers = {
        teacherName: body.teacherName,
        email: body.email,
        password: encrypted_Password,
        class: body.class,
        stream:body.stream

    }
    console.log(teachers);

    connection.query("select email from teachers WHERE email = '" + req.body.email + "'", (err, result, field) => {
        if (result.length == 0) {
            let sql1 = "INSERT INTO teachers SET ?";
            let query = connection.query(sql1, teachers, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("you have register successfully");
                    res.json({
                        message: "you have register successfully"
                    })
                }
            })
        } else {
            console.log("you are already register, please login your account");
            res.json({
                message: "you are already register, please login your account"
            })
        }
    })
})

app.post("/loginTeacher", (req, res) => {
    let body = req.body;
    let teachers = {
        email: body.email,
        password: body.password
    }
    console.log(teachers);

    connection.query("select * from teachers WHERE email = '" + req.body.email + "'", async (err, result, field) => {
        if (err) {
            console.log(err);
            res.json({
                "failed": "error occur"
            })
        } else {
            if (result.length > 0) {
                let compare_Password = await bcrypt.compare(req.body.password, result[0].password);
                if (compare_Password) {
                    console.log("you have login successfully");
                    res.json({
                        message: "you have login successfully"
                    })
                } else {
                    console.log("password does not match");
                    res.json({
                        message: "password does not match"
                    })
                }
            } else {
                console.log("email does not match");
                res.json({
                    message: "email does not match"
                })
            }

        }

    })
})



connection.query("SELECT * FROM students WHERE id = '1'", function (err, result) {
    if (err) throw err;
    console.log(result);
  });


app.listen(8000, () => {
    console.log("server has strated on port 8000");
})
