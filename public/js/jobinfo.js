// Function to fetch data from the JSON file
function fetchData(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "js/job_data.json");
    xhr.onload = function () {
        if (xhr.status === 200) {
            var jsonData = JSON.parse(xhr.responseText);
            callback(jsonData);
        } else {
            console.error("Failed to fetch data");
        }
    };
    xhr.onerror = function () {
        console.error("Error during the XMLHttpRequest");
    };
    xhr.send();
}

// Function to display details for a specific job on the "jobinfo.html" page
function showJobDetails(data, jobId) {
    var jobNameContainer = document.getElementById("job-name");
    var jobShortTextContainer = document.getElementById("job-shorttext");
    var jobLongTextContainer = document.getElementById("job-longtext");
    var jobCompanyContainer = document.getElementById("job-company");
    var jobLocationContainer = document.getElementById("job-location");

    if (data.hasOwnProperty(jobId)) {
        var jobData = data[jobId];

        jobNameContainer.innerText = jobData.jobName;
        jobShortTextContainer.innerText = jobData.jobShortText;
        jobLongTextContainer.innerText = jobData.jobLongText;
        jobCompanyContainer.innerText = "Company: " + jobData.jobCompany;
        jobLocationContainer.innerText = "Location: " + jobData.jobLocation;
    } else {
        console.error("Job ID not found in data");
    }
}

// Function to navigate to jobinfo.html with the specific job ID
function viewJobDetails(jobId) {
    window.location.href = `jobinfo.html?id=${jobId}`;
}

// Initial page load
window.onload = function () {
    var jobId = getJobIdFromUrl();
    if (jobId) {
        fetchData(function (data) {
            showJobDetails(data, jobId);
        });
    } else {
        console.error("Job ID not specified in the URL");
    }

	document.getElementById('postbutton').onclick = getData;

};
function saveJob() {
    var jobId = getJobIdFromUrl();
    
    // Make an AJAX request to save the job
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/savejob");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert("Job saved successfully!");
            } else {
                alert("Job already saved!");
            }
        }
    };
    xhr.send(JSON.stringify({ savedjobId: jobId }));
}

//ระบบคอมเม้น
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
	var divTag = document.getElementById("comment-container");
	divTag.innerHTML = "";
	for (var i = keys.length - 1; i >= 0; i--) {
	  var temp = document.createElement("div");
	  temp.className = "commented";
	  divTag.appendChild(temp);
	  var temp1 = document.createElement("div");
	  temp1.className = "commnettext";
	  temp1.innerHTML = data[keys[i]]["post"];
	  temp.appendChild(temp1);
	  var temp1 = document.createElement("div");
	  temp1.className = "commnetname";
  
      temp.appendChild(temp1);
	  temp1.innerHTML = data[keys[i]]["username"]; 
	  
	}
  }
// Function to get the job ID from the URL
function getJobIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function getData(){
	var msg = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	await writePost(msg);
	await readPost();
}
