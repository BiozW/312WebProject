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
