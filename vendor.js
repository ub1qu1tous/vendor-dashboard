// vendors.js
import { fetchGoogleAppsScriptData } from './appscript-data.js'; // Import the new function

function fetchVendorList() {
  // Use the imported function to fetch data
  fetchGoogleAppsScriptData()
    .then(data => {
      // data is expected to be an array of objects directly from Apps Script
      if (!data || data.length === 0) {
        console.warn("No data received from Google Apps Script or data is empty.");
        document.getElementById("vendor-index").innerHTML = "<p>No vendor data available.</p>";
        return;
      }

      const vendorMap = {};
      data.forEach(item => {
        // The 'item' here is already a normalized object from the Apps Script
        if (item.vendor && item.vendor.trim() !== "") {
          const vendorName = item.vendor.trim();
          if (!vendorMap[vendorName]) {
            vendorMap[vendorName] = 0;
          }
          vendorMap[vendorName]++;
        }
      });

      const container = document.getElementById("vendor-index");
      container.innerHTML = ""; // Clear previous content

      if (Object.keys(vendorMap).length === 0) {
        container.innerHTML = "<p>No active vendors found.</p>";
      } else {
        Object.keys(vendorMap).sort().forEach(vendor => {
          const link = document.createElement("a");
          link.href = `vendor.html?vendor=${encodeURIComponent(vendor)}`;
          link.textContent = `${vendor} (${vendorMap[vendor]})`;
          container.appendChild(link);
        });
      }
    })
    .catch(error => {
      console.error("Error fetching or processing vendor list data:", error);
      document.getElementById("vendor-index").innerHTML = "<p>Error loading vendor list. Please try again later.</p>";
    });
}

// Initial fetch when the page loads
fetchVendorList();

// Refresh data every 10 seconds (adjust as needed)
setInterval(fetchVendorList, 10000);