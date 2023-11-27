const express = require("express");
const app = express();
const fs = require("fs");
const hostname = "localhost";
const port = 3020;
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
    callback(null, 'public/img/');
  },

  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const imageFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
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

// app.post('/regisDB', async (req,res) => {
//   const { username, email, password, confirmPassword } = req.body;

//   if (!validateForm(password, confirmPassword)) {
//       return res.redirect('register.html?error=2'); // รหัสผ่านไม่ตรงกัน
//   }

//   try {
//       // สร้างตาราง userInfo ถ้ายังไม่มี
//       const createTableQuery = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255), email VARCHAR(100), password VARCHAR(100), confirmPassword VARCHAR(100), img VARCHAR(100))";
//       await queryDB(createTableQuery);

//       // สร้างตาราง post ถ้ายังไม่มี
//       const createTablePost = "CREATE TABLE IF NOT EXISTS userpost (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, post VARCHAR(255), username VARCHAR(255))";
//       await queryDB(createTablePost);

//       // ตรวจสอบว่า username ซ้ำหรือไม่
//       const checkUsernameQuery = `SELECT * FROM userInfo WHERE username = "${username}"`;
//       const existingUser = await queryDB(checkUsernameQuery);

//       if (existingUser.length > 0) {
//           console.log("Username is already taken");
//           return res.redirect('register.html?error=1');
//       }

//       // Username ไม่ซ้ำ, ทำการลงทะเบียนผู้ใช้
//       const insertUserQuery = `INSERT INTO userInfo (username, email, password, confirmPassword, img) VALUES ("${username}", "${email}", "${password}", "${confirmPassword}", "avatar.png")`;
//       await queryDB(insertUserQuery);

//       console.log("New record created successfully");
//       return res.redirect('login.html');
//   } catch (error) {
//       console.error('Error checking username or inserting new record:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//   }
// })



app.post('/profilepic', (req,res) => {
  let upload = multer({ storage: storage, fileFilter: imageFilter }).single(
  "avatar"
);
upload(req, res, (err) => {
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  } else if (!req.file) {
    return res.send("Choose an image to upload");
  } else if (err instanceof multer.MulterError) {
    return res.send(err);
  } else if (err) {
    return res.send(err);
  }
  updateImg(req.cookies.username, req.file.filename);
  res.cookie("img", req.file.filename);
  return res.redirect("profileedit.html");
});
})

const updateImg = async (username, filen) => {
  let sql = `UPDATE userInfo SET img = '${filen}' WHERE username = '${username}'`;
  let result = await queryDB(sql);
  console.log(result);
  
}


//LOGOUT
app.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.clearCookie("img");
  return res.redirect("index.html");
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

app.get("/checklogined", (req, res) => {
  
  return res.redirect("profile.html")
  
});

app.post("savejob",async (req,res) =>{
  if(sdsddsd){
    let sql="";
  }

})

app.listen(port, hostname, () => {
  console.log(`Server running at   http://${hostname}:${port}/index.html`);
});
