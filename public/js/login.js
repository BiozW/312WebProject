window.onload = pageLoad;

function pageLoad(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if (urlParams.get("error")==1){
		if (window.location.href.split('/').pop()== "register.html"){
			document.getElementById('errordisplay').innerHTML = "Registration Error!"
		}else{
			document.getElementById('errordisplay').innerHTML = "Username or password does not match.";
		}
	}	
	if (urlParams.get("error")==2){
		if (window.location.href.split('/').pop()== "register.html"){
			document.getElementById('errordisplay').innerHTML = "Registration Error!"
		}else{
			document.getElementById('errordisplay').innerHTML = "Username or password does not match.";
		}
	}
}

// register.html

function validateForm() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
    }

    return true;
}

function performSearch() {
    var searchInput = document.getElementById('searchInput').value;
    alert('Performing search for: ' + searchInput);
}

function goToRegister() {
    window.location.href = 'register.html';
}