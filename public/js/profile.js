// check ว่ามีการ set cookies หรือยังถ้ามีจะไปยัง profile.html แต่ถ้าไม่มีจะกลับไปที่ login.html
function checkCookie(){
	var username = "";
	if(getCookie("username")===false){
		window.location = "login.html";
	}
}

checkCookie();
window.onload = pageLoad;

function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}

function pageLoad(){
	
	var username = getCookie('username');

	document.getElementById("profile-name").innerHTML = username;
	console.log(getCookie('img'));
	showImg('img/'+getCookie('img'));
    Updatepersonalinfo();
	Updatepersonaport();
}

function Updatepersonalinfo(){
	fetch('/showPersonalData')
    .then(response => response.json())
    .then(data => {
      // นำข้อมูลที่ได้จากเซิร์ฟเวอร์มาแสดงผลใน HTML
      document.getElementById('profile-name').textContent = data.username;
      document.getElementById('profile-fullname').textContent = `${data.firstname} ${data.surname}`;
	  document.getElementById('profile-company').textContent = `${data.company}`;
	  document.getElementById('profile-location').textContent = `${data.location}`;
	  document.getElementById('profile_callnumber').textContent = `${data.phone_number}`;
      // แสดงข้อมูลอื่น ๆ ที่ต้องการ
    })
    .catch(error => console.error('Error:', error));
}

function Updatepersonaport(){
	fetch('/showPersonalPort')
    .then(response => response.json())
    .then(data => {
      // นำข้อมูลที่ได้จากเซิร์ฟเวอร์มาแสดงผลใน HTML
      document.getElementById('aboutdetail').innerHTML = data.about;
      document.getElementById('skilldetail').innerHTML = data.skill;
	  document.getElementById('activitydetail').innerHTML = data.activity;
	  document.getElementById('educationdetail').innerHTML = data.education;
      // แสดงข้อมูลอื่น ๆ ที่ต้องการ
    })
    .catch(error => console.error('Error:', error));
}

function getData(){
	var msg = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	writePost(msg);
}

function fileUpload(){
	document.getElementById('fileField').click();
}

function fileSubmit(){
	document.getElementById('formId').submit();
}

// แสดงรูปในพื้นที่ที่กำหนด
function showImg(filename){
	if (filename !==""){
		var showpic = document.getElementById('displayPic');
		showpic.innerHTML = "";
		var temp = document.createElement("img");
		temp.src = filename;
		showpic.appendChild(temp);
	}
}

