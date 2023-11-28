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


function createJobListings(data) {
    var mainContainer = document.querySelector(".main-container");

    for (var jobId in data) {
        var jobData = data[jobId];

        var jobContainer = document.createElement("div");
        jobContainer.classList.add("joblist");

        jobContainer.innerHTML = `
            <div id="job-img"><img src = ${jobData.jobImage} alt=${jobData.jobImage}>
            </div>
            <div id="job-shortdetail">
                <div id="job-name">${jobData.jobName}</div>
                <div id="job-shorttext">${jobData.jobShortText}</div>
                <div id="job-company">${jobData.jobCompany}</div>
                <div id="job-location">${jobData.jobLocation}</div>
            </div>
            <div id="seemore-btn">
                <button onclick="viewJobDetails('${jobId}')">See More</button>
            </div>
        `
        // Append the job listing div to the main container
        mainContainer.appendChild(jobContainer);
    }
}
function Searchdata() {

    var searchInput = document.getElementById('search').value.toLowerCase();

        fetchData(function (data) {
        var searchResult = Object.keys(data)
            .filter(id => data[id].jobName.toLowerCase().includes(searchInput))
            .reduce((result, id) => {
                result[id] = data[id];
                alert("path entered");
                return result;
            },{});
        createJobListings(searchResult);
    });
    
}
// Function to navigate to jobinfo.html with the specific job ID
function viewJobDetails(jobId) {
    window.location.href = `jobinfo.html?id=${jobId}`;
}

window.onload = function () {
    fetchData(createJobListings);
};
