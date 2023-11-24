const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
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

// ใส่ค่าตามที่เราตั้งไว้ใน mysql
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

//ทำให้สมบูรณ์
app.post('/regisDB', async (req,res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!validateForm(password, confirmPassword)) {
        return res.redirect('register.html?error=2'); // รหัสผ่านไม่ตรงกัน
    }

    try {
        // สร้างตาราง userInfo ถ้ายังไม่มี
        const createTableQuery = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255), email VARCHAR(100), password VARCHAR(100), confirmPassword VARCHAR(100), img VARCHAR(100))";
        await queryDB(createTableQuery);

        // สร้างตาราง post ถ้ายังไม่มี
        const createTablePost = "CREATE TABLE IF NOT EXISTS post (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, text VARCHAR(255), username VARCHAR(255))";
        await queryDB(createTablePost);

        // ตรวจสอบว่า username ซ้ำหรือไม่
        const checkUsernameQuery = `SELECT * FROM userInfo WHERE username = "${username}"`;
        const existingUser = await queryDB(checkUsernameQuery);

        if (existingUser.length > 0) {
            console.log("Username is already taken");
            return res.redirect('register.html?error=1');
        }

        // Username ไม่ซ้ำ, ทำการลงทะเบียนผู้ใช้
        const insertUserQuery = `INSERT INTO userInfo (username, email, password, confirmPassword) VALUES ("${username}", "${email}", "${password}", "${confirmPassword}")`;
        await queryDB(insertUserQuery);

        console.log("New record created successfully");
        return res.redirect('login.html');
    } catch (error) {
        console.error('Error checking username or inserting new record:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

function validateForm(password, confirmPassword) {
    return password === confirmPassword;
}

//ทำให้สมบูรณ์
app.post('/profilepic', (req,res) => {
    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('avatar');

    upload(req, res, async (err) => {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        console.log('You uploaded this image filename: ' + req.file.filename);
        
        const img_file = req.file.filename;
        const user = req.cookies["username"];
        await res.cookie("img",img_file)
        await updateImg(user,img_file);

        try {
            // อัปเดตภาพโปรไฟล์ในฐานข้อมูล MySQL
            const updateImgQuery = `UPDATE userInfo SET img = '${img_file}' WHERE username = '${user}'`;
            await queryDB(updateImgQuery);
            return res.redirect('feed.html');
        } catch (error) {
            console.error('Error updating profile image in the database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
})

const updateImg = async (username, img_file) => {
    try {
        // ดึงข้อมูลผู้ใช้จากฐานข้อมูล MySQL
        const getUserQuery = `SELECT * FROM userInfo WHERE username = '${username}'`;
        const userData = await queryDB(getUserQuery);

        if (userData.length > 0) {
            // อัปเดตข้อมูลรูปภาพในฐานข้อมูล MySQL
            const updateUserImgQuery = `UPDATE userInfo SET img = '${img_file}' WHERE username = '${username}'`;
            await queryDB(updateUserImgQuery);
        } else {
            console.log('User not found in the database');
        }
    } catch (error) {
        console.error('Error updating user image in the database:', error);
    }
}

//ทำให้สมบูรณ์
app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('login.html');
})

//ทำให้สมบูรณ์
app.get('/readPost', async (req,res) => {
    try {
        const sql = 'SELECT * FROM post';
        const result = await queryDB(sql);
        res.json(result);
    } catch (error) {
        console.error('Error reading posts from database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//ทำให้สมบูรณ์
app.post('/writePost',async (req,res) => {
    try {
        const { user, message } = req.body;

        const sql = `INSERT INTO post (username, text) VALUES ("${user}", "${message}")`;
        await queryDB(sql);

        res.end();
    } catch (error) {
        console.error('Error writing post to database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//ทำให้สมบูรณ์
app.post('/checkLogin',async (req,res) => {
    // ถ้าเช็คแล้ว username และ password ถูกต้อง
    // return res.redirect('feed.html');
    // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
    // return res.redirect('login.html?error=1')
    const { username, password } = req.body;

    const sql = `SELECT * FROM userInfo WHERE username = "${username}"`;

    try {
        const result = await queryDB(sql);
        const user = result[0];

        if (user && user.password === password) {
            // ถ้าชื่อผู้ใช้และรหัสผ่านถูกต้อง
            res.cookie('username', username);
            res.cookie('img',user.img)
            return res.redirect('feed.html');
        } else {
            // ถ้าชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
            return res.redirect('login.html?error=1');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:', error);
        return res.redirect('login.html?error=1');
    }
    
})

 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/main.html`);
});
