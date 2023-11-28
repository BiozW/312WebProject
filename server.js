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
const { profile } = require("console");

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
app.post("/regisDB", (req, res) => {
  let now_date = new Date().toISOString().slice(0, 19).replace("T", " ");

  let sqlCreateTable =
    "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255), email VARCHAR(100), password VARCHAR(100), img VARCHAR(100), firstname VARCHAR(255), surname VARCHAR(255), company VARCHAR(255), location VARCHAR(255), phone_number VARCHAR(10), about TEXT, skill TEXT, activity TEXT, education TEXT)";

  // Execute CREATE TABLE query
  con.query(sqlCreateTable, (err) => {
    if (err) {
      console.error("Error creating table:", err);
      return res.status(500).send("An error occurred while processing your request");
    }

    let sqlInsertData = `INSERT INTO userInfo (username, reg_date, email, password, img, firstname, surname, company, location, phone_number, about, skill, activity, education) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    let insertValues = [
      req.body.username,
      now_date,
      req.body.email,
      req.body.password,
      "avatar.png",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ];

    // Execute INSERT INTO query
    con.query(sqlInsertData, insertValues, (err) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).send("An error occurred while processing your request");
      }

      // Redirect after successful insertion
      return res.redirect("login.html");
    });
  });
});

app.post('/updatePersonalData', (req, res) => {
  const { firstname, surname, work, location, call } = req.body;

  const username = req.cookies.username;
  
  const sql = `UPDATE userInfo 
               SET firstname = '${firstname}', 
                   surname = '${surname}', 
                   company = '${work}', 
                   location = '${location}', 
                   phone_number = '${call}' 
               WHERE username = '${username}'`;
  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Data inserted:', result);
    return res.redirect("profileedit.html");
  });
});

app.post('/updatePersonalPort', (req, res) => {
  const aboutText = req.body.about || ''; // ตรวจสอบและแทนที่ค่าว่างด้วยค่าเริ่มต้นเมื่อข้อมูลมาจาก textarea เป็นค่าว่าง
  const skillsText = req.body.skills || '';
  const activityText = req.body.activity || '';
  const educationText = req.body.education || '';

  const username = req.cookies.username;

  const sql = `UPDATE userInfo SET about = ?, skill = ?, activity = ?, education = ? WHERE username = ?`; // ใช้ ? ในการส่งค่าพารามิเตอร์

  con.query(sql, [aboutText, skillsText, activityText, educationText, username], (err, result) => {
    if (err) {
      console.error('Error while updating data:', err);
      res.status(500).send('Error while updating data');
    } else {
      console.log('Data updated successfully');
      res.redirect("profileedit.html");
    }

  });
});

app.get('/showPersonalData', (req, res) => {
  const username = req.cookies.username; // หรือวิธีการรับค่า username ของผู้ใช้

  const sql = `SELECT * FROM userInfo WHERE username = '${username}'`;

  con.query(sql, (err, result) => {
    if (err) {
      throw err;
    }

    const userData = result[0]; // ข้อมูลของผู้ใช้

    res.json(userData); // ส่งข้อมูลผู้ใช้กลับไปยังเบราว์เซอร์ในรูปแบบ JSON
  });
});


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
