function createJobListings(data) {
    var mainContainer = document.querySelector(".main-container");

    for (var jobId in data) {
        var jobData = data[jobId];

        var jobContainer = document.createElement("div");
        jobContainer.classList.add("joblist");

        jobContainer.innerHTML = `
            <div id="job-img">${jobData.JobImage}</div>
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
                console.log("code reached");
                result[id] = data[id];
                return result;
            },{});
            console.log("code reached");
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

// document.addEventListener("DOMContentLoaded", function () {
//     // Function to fetch saved jobs from the server
//     function fetchSavedJobs() {
//         // Make an AJAX request to the server endpoint that provides saved jobs
//         fetch("/fetchSavedJobs", {
//             method: "GET",
//             credentials: "same-origin", // Include cookies in the request
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 // Check if the data is successfully retrieved
//                 if (data && data.success) {
//                     // Update the HTML to display saved jobs
//                     displaySavedJobs(data.savedJobs);
//                 } else {
//                     console.error("Failed to fetch saved jobs:", data.message);
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error fetching saved jobs:", error);
//             });
//     }

//     // Function to update the HTML and display saved jobs
//     function displaySavedJobs(savedJobs) {
//         const mainContainer = document.querySelector(".main-container");

//         // Clear existing content in the main container
//         mainContainer.innerHTML = "";

//         // Check if there are saved jobs to display
//         if (savedJobs.length > 0) {
//             savedJobs.forEach((job) => {
//                 // Create HTML elements for each saved job
//                 const jobDiv = document.createElement("div");
//                 jobDiv.classList.add("joblist");

//                 // Populate job details in the created elements
//                 jobDiv.innerHTML = `
//                     <div id="job-img">
//                         <img src="${job.jobImage}" alt="${job.jobName}">
//                     </div>
//                     <div id="job-shortdetail">
//                         <div id="job-name">${job.jobName}</div>
//                         <div id="job-shorttext">${job.jobShortText}</div>
//                         <div id="job-company">${job.jobCompany}</div>
//                         <div id="job-location">${job.jobLocation}</div>
//                     </div>
//                     <div id="seemore-btn">
//                         <button onclick="viewJobDetails('${job.id}')">See More</button>
//                     </div>
//                 `;

//                 // Append the created job element to the main container
//                 mainContainer.appendChild(jobDiv);
//             });
//         } else {
//             // Display a message if there are no saved jobs
//             mainContainer.innerHTML = "<p>No saved jobs found.</p>";
//         }
//     }

//     // Function to handle viewing more details of a job
//     function viewJobDetails(jobId) {
//         // Implement the logic to view more details of a specific job
//         console.log("Viewing details of job with ID:", jobId);
//     }

//     // Fetch saved jobs when the page loads
//     fetchSavedJobs();
// });
