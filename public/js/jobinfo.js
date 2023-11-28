
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
// window.onload = function () {
    var jobId = getJobIdFromUrl();
    if (jobId) {
        fetchData(function (data) {
            showJobDetails(data, jobId);
        });
    } else {
        console.error("Job ID not specified in the URL");
    }

// };


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

function getJobIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
