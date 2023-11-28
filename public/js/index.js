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

function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}