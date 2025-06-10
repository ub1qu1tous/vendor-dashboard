function fetchVendorList() {
  fetch("/.netlify/functions/vendor-data")
    .then(res => res.json())
    .then(rawData => { // rawData is now the 2D array from the sheet
      if (!rawData || rawData.length === 0) {
        console.warn("No data received from vendor-data API.");
        return;
      }

      const headers = rawData[0]; // First row is headers
      const dataRows = rawData.slice(1); // Rest are data rows

      // Map headers to their column index for easy lookup (optional for vendors.js, but good practice)
      const headerMap = new Map();
      headers.forEach((header, index) => headerMap.set(header.trim(), index)); // .trim() for safety

      // --- Replicating the vendor extraction logic from original Apps Script ---
      const vendorMap = {};
      const vendorStartCol = 20; // As per original Apps Script
      const vendorBlockSize = 6;  // As per original Apps Script
      const vendorSlots = 8;      // As per original Apps Script

      dataRows.forEach(row => {
        for (let j = 0; j < vendorSlots; j++) {
          const offset = vendorStartCol + j * vendorBlockSize;
          const vendor = row[offset]; // Vendor name from the raw sheet
          const ready = row[offset + 5]; // Ready to Ship status

          if (vendor && String(vendor).trim() !== "" && ready !== true) { // Ensure vendor is not empty and not ready to ship
            const vendorName = String(vendor).trim(); // Normalize vendor name
            if (!vendorMap[vendorName]) {
              vendorMap[vendorName] = 0;
            }
            vendorMap[vendorName]++;
          }
        }
      });
      // --- End of vendor extraction logic ---

      const container = document.getElementById("vendor-index");
      container.innerHTML = "";
      Object.keys(vendorMap).sort().forEach(vendor => {
        const link = document.createElement("a");
        link.href = `vendor.html?vendor=${encodeURIComponent(vendor)}`;
        link.textContent = `${vendor} (${vendorMap[vendor]})`;
        container.appendChild(link);
      });
    })
    .catch(error => {
      console.error("Error fetching or processing vendor list data:", error);
      // Display a user-friendly error message if needed
      document.getElementById("vendor-index").innerHTML = "<p>Error loading vendor list. Please try again later.</p>";
    });
}

fetchVendorList();