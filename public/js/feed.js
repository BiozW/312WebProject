// check ว่ามีการ set cookies หรือยังถ้ามีจะไปยัง feed.html แต่ถ้าไม่มีจะกลับไปที่ login.html
function checkCookie(){
	var username = "";
	if(getCookie("username")==false){
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
	document.getElementById('postbutton').onclick = getData;
	
	var username = getCookie('username');

	document.getElementById("username").innerHTML = username;
	readPost();

}

setInterval(readPost(),2000);


function getData(){
	var msg = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	writePost(msg);
}

// complete it
async function readPost(){
	try {
        const response = await fetch("/readPost");
        const data = await response.json();
        showPost(data);
    } catch (error) {
        console.error('Error reading posts:', error);
    }
	
}

// complete it
async function writePost(msg){
	try {
        const response = await fetch("/writePost", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: getCookie("username"),
                message: msg
            })
        });
        // อัพเดทหน้าเว็บหลังจากที่ทำการเขียนโพสต์
        readPost();
    } catch (error) {
        console.error('Error writing post:', error);
    }
}


// แสดง post ที่อ่านมาได้ ลงในพื้นที่ที่กำหนด
function showPost(data){
	var keys = Object.keys(data);
	var divTag = document.getElementById("comment-container");
	divTag.innerHTML = "";
	for (var i = keys.length-1; i >=0 ; i--) {

		var temp = document.createElement("div");
		temp.className = "comment";
		divTag.appendChild(temp);
		var temp1 = document.createElement("div");
		temp1.className = "postmsg";
		temp1.innerHTML = data[keys[i]]["post"];
		temp.appendChild(temp1);
		var temp1 = document.createElement("div");
		temp1.className = "postuser";
		
		temp1.innerHTML = ""+data[keys[i]]["username"];
		temp.appendChild(temp1);
		
	}
}