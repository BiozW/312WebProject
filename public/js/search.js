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
  
  // Function to display data on the page
  function showData(data) {
    var layer = document.getElementById("layer");
    layer.innerHTML = ""; // Clear previous data
  
    for (var id in data) {
        var jobData = data[id];
  
        var jobContainer = document.createElement("div");
  
        var jobName = document.createElement("p");
        jobName.innerText = "Job: " + jobData.jobName;
  
        var contractor = document.createElement("p");
        contractor.innerText = "Contractor: " + jobData.contractor;
  
        var earth = document.createElement("p");
        earth.innerText = "From: " + jobData.earth;
  
        var pay = document.createElement("p");
        pay.innerText = "Pay: " + jobData.pay;
  
        var details = document.createElement("p");
        details.innerText = "Details: " + jobData.details;
  
        // Create a button
        var detailsButton = document.createElement("button");
        detailsButton.innerText = "View Details";
        detailsButton.onclick = function () {
            // Redirect to jobdetails.html
            window.location.href = "joblist.html";
        };
  
        jobContainer.appendChild(jobName);
        jobContainer.appendChild(contractor);
        jobContainer.appendChild(earth);
        jobContainer.appendChild(pay);
        jobContainer.appendChild(details);
        jobContainer.appendChild(detailsButton); // Append the button
  
        layer.appendChild(jobContainer);
    }
  }
  
  
  // Function to filter data based on search input
  function Searchdata() { // Corrected function name
    var searchInput = document.getElementById('search').value.toLowerCase();
  
    fetchData(function (data) {
        var searchResult = Object.keys(data)
            .filter(id => data[id].jobName.toLowerCase().includes(searchInput))
            .reduce((result, id) => {
                result[id] = data[id];
                return result;
            }, {});
  
        showData(searchResult);
    });
  }
  
  // Initial page load
  window.onload = function () {
    fetchData(showData);
  };