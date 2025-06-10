function fetchVendorList() {
  fetch("/.netlify/functions/vendor-data")
    .then(res => res.json())
    .then(rawData => { // rawData is now the 2D array from the Apps Script with filtered columns and unique headers
      if (!rawData || rawData.length === 0) {
        console.warn("No data received from vendor-data API or data is empty.");
        // Clear existing list if no data
        document.getElementById("vendor-index").innerHTML = "<p>No vendor data available.</p>";
        return;
      }

      const headers = rawData[0]; // First row is the new, unique headers
      const dataRows = rawData.slice(1); // Rest are data rows

      const headerMap = new Map();
      headers.forEach((header, index) => headerMap.set(header.trim(), index));

      const vendorMap = {};

      dataRows.forEach(row => {
        // Iterate through all 8 possible vendor slots
        for (let j = 1; j <= 8; j++) {
          const vendorHeader = `Vendor ${j}`;
          const readyHeader = `Vendor ${j} Ready to Ship?`; // Use the unique header name

          const vendorColIndex = headerMap.get(vendorHeader);
          const readyColIndex = headerMap.get(readyHeader);

          // Ensure headers exist for this vendor slot
          if (vendorColIndex !== undefined && readyColIndex !== undefined) {
            const vendor = row[vendorColIndex];
            const ready = row[readyColIndex];

            // Only count if vendor name is present and not ready to ship
            if (vendor && String(vendor).trim() !== "" && ready !== true) {
              const vendorName = String(vendor).trim();
              if (!vendorMap[vendorName]) {
                vendorMap[vendorName] = 0;
              }
              vendorMap[vendorName]++;
            }
          }
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