// check ว่ามีการ set cookies หรือยังถ้ามีจะไปยัง feed.html แต่ถ้าไม่มีจะกลับไปที่ login.html
function checkCookie(){
	var username = "";
	if(getCookie("username")===false){
		window.location = "login.html";
	}
}
function redirectToJobList(){
    window.location.href = 'joblist.html';
}

checkCookie();

  function getCookie(name) {
	var value = "";
	try {
	  value = document.cookie
		.split("; ")
		.find((row) => row.startsWith(name))
		.split("=")[1];
	  return value;
	} catch (err) {
	  return false;
	}
  }
  
  function pageLoad() {
	document.getElementById("postbutton").onclick = getData;
  
	document.getElementById("displayPic").onclick = fileUpload;
	document.getElementById("fileField").onchange = fileSubmit;

	var username = getCookie("username");
  
	document.getElementById("username").innerHTML = username;
	console.log(getCookie("img"));
	showImg("img/" + getCookie("img"));

	readPost();
  }
  
  async function getData() {
	var msg2 = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	await writePost(msg2);
	await readPost();
  }
  
  function fileUpload() {
	document.getElementById("fileField").click();
  }
  
  function fileSubmit() {
	document.getElementById("formId").submit();
  }
  
  // แสดงรูปในพื้นที่ที่กำหนด
  function showImg(filename) {
	if (filename !== "") {
	  var showpic = document.getElementById("displayPic");
	  showpic.innerHTML = "";
	  var temp = document.createElement("img");
	  temp.src = filename;
	  showpic.appendChild(temp);
	}
  }

  function showResume(filename) {
	if (filename !== "") {
	  var showresume = document.getElementById("resumePic");
	  showresume.innerHTML = "";
	  var temp = document.createElement("resume");
	  temp.src = filename;
	  showpic.appendChild(temp);
	}
  }
  
  // complete it
  async function readPost() {
	let response = await fetch("/readPost");
	let content = await response.json();
	showPost(content);
  }
  
  // complete it
  async function writePost(msg) {
	let response = await fetch("/writePost", {
	  method: "POST",
	  headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	  },
	  body: JSON.stringify({
		user: getCookie("username"),
		message: msg,
	  }),
	});
  }
  
  // แสดง post ที่อ่านมาได้ ลงในพื้นที่ที่กำหนด
  function showPost(data) {
	var keys = Object.keys(data);
	console.log(keys);
	var divTag = document.getElementById("feed-container");
	divTag.innerHTML = "";
	for (var i = keys.length - 1; i >= 0; i--) {
	  var temp = document.createElement("div");
	  temp.className = "newsfeed";
	  divTag.appendChild(temp);
	  var temp1 = document.createElement("div");
	  temp1.className = "postmsg";
	  temp1.innerHTML = data[keys[i]]["post"];
	  temp.appendChild(temp1);
	  var temp1 = document.createElement("div");
	  temp1.className = "postuser";
  
	  temp1.innerHTML = "Posted by: " + data[keys[i]]["username"];
	  temp.appendChild(temp1);
	}
  }

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }

  window.onload = pageLoad;
