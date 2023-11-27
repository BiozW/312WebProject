const express = require("express");
const app = express();
const fs = require("fs");
const hostname = "localhost";
const port = 3000;
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql");
const { userInfo } = require("os");
const { constrainedMemory } = require("process");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
  callback(null, "public/img/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// mysql
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "userdata",
});

con.connect((err) => {
  if (err) throw err;
  else {
    console.log("MySQL connected");
  }
});

const queryDB = (sql) => {
  return new Promise((resolve, reject) => {
    // query method
    con.query(sql, (err, result, fields) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//LOGIN
app.post("/regisDB", async (req, res) => {
  let now_date = new Date().toISOString().slice(0, 19).replace("T", " ");
  let sql =
    "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100),img VARCHAR(100))";
  let result = await queryDB(sql);
  sql = `INSERT INTO userInfo (username, reg_date, email, password, img) VALUES ("${req.body.username}", "${now_date}","${req.body.email}", "${req.body.password}", "avatar.png")`;
  result = await queryDB(sql);
  return res.redirect("login.html");
});

//PROFILE
app.post("/profilepic", async (req, res) => {
  let upload = multer({ storage: storage, fileFilter: imageFilter }).single(
    "avatar"
  );
  upload(req, res, (err) => {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }
    updateImg(req.cookies.username, req.file.filename);
    res.cookie("img", req.file.filename);
    return res.redirect("feed.html");
  });
});

const updateImg = async (username, filen) => {
  let sql = `UPDATE userInfo SET img = '${filen}' WHERE username = '${username}'`;
  let result = await queryDB(sql);
  console.log(result);
};

//LOGOUT
app.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.clearCookie("img");
  return res.redirect("login.html");
});

//ทำให้สมบูรณ์
// app.get("/readPost", async (req, res) => {
//   let sql =
//     "CREATE TABLE IF NOT EXISTS userPost (username VARCHAR(255), post VARCHAR(500))";
//   let result = await queryDB(sql);
//   sql = `SELECT post, username FROM userPost`;
//   result = await queryDB(sql);
//   result = Object.assign({}, result);
//   console.log(result);
//   res.json(result);
// });

//ทำให้สมบูรณ์
// app.post("/writePost", async (req, res) => {
//     let sql =
//     "CREATE TABLE IF NOT EXISTS userPost (username VARCHAR(255), post VARCHAR(500))";
//   let result = await queryDB(sql);
//   sql = `INSERT INTO userPost (username,post) VALUES ("${req.body.user}", "${req.body.message}")`;
//   result = await queryDB(sql);
//   res.redirect("feed.html");
// });

//Register
app.post("/checkLogin", async (req, res) => {
    let sql = `SELECT username, img, password FROM userInfo`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
     var keys = Object.keys(result);
    var IsCorrect = false;
    for (var numberOfKeys = 0; numberOfKeys < keys.length; numberOfKeys++) {
    if (
      req.body.username == result[keys[numberOfKeys]].username &&
      req.body.password == result[keys[numberOfKeys]].password
    ) {
      console.log("login successful");
      res.cookie("username", result[keys[numberOfKeys]].username);
      res.cookie("img", result[keys[numberOfKeys]].img);
      IsCorrect = true;
      return res.redirect("index.html");
    }
  }
  if (IsCorrect == false) {
    IsCorrect = false;
    console.log("login failed");
    return res.redirect("login.html?error=1");
  }
  // ถ้าเช็คแล้ว username และ password ถูกต้อง
  // return res.redirect('feed.html');
  // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
  // return res.redirect('login.html?error=1')
});

const createSavedJobTable = async () => {
  let sql =
    "CREATE TABLE IF NOT EXISTS savedjob (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), savedjobId VARCHAR(255))";
  let result = await queryDB(sql);
  console.log("SavedJob table created");
};

createSavedJobTable(); // Call the function to create the table when the server starts

// Endpoint to save a job
app.post("/savejob", async (req, res) => {
  const username = req.cookies.username;
  const savedjobId = req.body.savedjobId;

  // Check if the job is already saved
  let sql = `SELECT * FROM savedjob WHERE username='${username}' AND savedjobId='${savedjobId}'`;
  let result = await queryDB(sql);

  if (result.length > 0) {
    console.log("Job already saved");
    res.json({ success: false, message: "Job already saved" });
  } else {
    // Save the job
    sql = `INSERT INTO savedjob (username, savedjobId) VALUES ('${username}', '${savedjobId}')`;
    result = await queryDB(sql);
    console.log("Job saved successfully");
    res.json({ success: true, message: "Job saved successfully" });
  }
});

app.listen(port, hostname, () => {
  console.log(`Server running at   http://${hostname}:${port}/index.html`);
});
