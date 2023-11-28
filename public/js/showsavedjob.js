document.addEventListener("DOMContentLoaded", function () {
    // Function to fetch saved jobs from the server
    function fetchSavedJobs() {
        // Make an AJAX request to the server endpoint that provides saved jobs
        fetch("/fetchSavedJobs", {
            method: "GET",
            credentials: "same-origin", // Include cookies in the request
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // Check if the data is successfully retrieved
                if (data && data.success) {
                    // Update the HTML to display saved jobs
                    displaySavedJobs(data.savedJobs);
                } else {
                    console.error("Failed to fetch saved jobs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching saved jobs:", error);
            });
    }

    // Function to update the HTML and display saved jobs
    function displaySavedJobs(savedJobs) {
        const mainContainer = document.querySelector(".main-container");

        // Clear existing content in the main container
        mainContainer.innerHTML = "";

        // Check if there are saved jobs to display
        if (savedJobs.length > 0) {
            savedJobs.forEach((job) => {
                // Create HTML elements for each saved job
                const jobDiv = document.createElement("div");
                jobDiv.classList.add("joblist");

                // Populate job details in the created elements
                jobDiv.innerHTML = `
                    <div id="job-img">
                        <img src="${job.jobImage}" alt="${job.jobName}">
                    </div>
                    <div id="job-shortdetail">
                        <div id="job-name">${job.jobName}</div>
                        <div id="job-shorttext">${job.jobShortText}</div>
                        <div id="job-company">${job.jobCompany}</div>
                        <div id="job-location">${job.jobLocation}</div>
                    </div>
                    <div id="seemore-btn">
                        <button onclick="viewJobDetails('${job.id}')">See More</button>
                    </div>
                `;

                // Append the created job element to the main container
                mainContainer.appendChild(jobDiv);
            });
        } else {
            // Display a message if there are no saved jobs
            mainContainer.innerHTML = "<p>No saved jobs found.</p>";
        }
    }

    // Function to handle viewing more details of a job
    function viewJobDetails(jobId) {
        // Implement the logic to view more details of a specific job
        console.log("Viewing details of job with ID:", jobId);
    }

    // Fetch saved jobs when the page loads
    fetchSavedJobs();
});
