const params = new URLSearchParams(window.location.search);
const vendorName = params.get("vendor");
document.getElementById("vendor-name").textContent = vendorName;

let lastDataHash = "";

// Helper function to parse dates - unchanged from original
function parseDate(dateStr) {
  if (!dateStr) return new Date(9999, 11, 31);
  // Ensure dateStr is a string before splitting
  const [day, monthStr, year] = String(dateStr).split('-');
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  // Add checks for valid numbers and month
  const parsedDay = parseInt(day);
  const parsedYear = parseInt(year);
  const parsedMonth = months[monthStr];

  if (isNaN(parsedDay) || isNaN(parsedYear) || parsedMonth === undefined) {
    console.warn(`Invalid date string encountered: ${dateStr}`);
    return new Date(9999, 11, 31); // Return a far future date for invalid dates
  }

  return new Date(parsedYear, parsedMonth, parsedDay);
}

// Helper function to format dates from Google Sheets (which might be ISO strings)
function formatDate(dateValue) {
  if (!dateValue) return "";
  if (typeof dateValue === 'string') {
      // If it's already a "DD-Mon-YYYY" string, return it as is
      if (/^\d{2}-\w{3}-\d{4}$/.test(dateValue)) {
          return dateValue;
      }
      // If it's an ISO string (e.g., "2025-06-03T18:30:00.000Z"), convert it
      try {
          const date = new Date(dateValue);
          // Check for invalid date
          if (isNaN(date.getTime())) {
              console.warn("Invalid date string for formatting:", dateValue);
              return dateValue; // Return original if parsing fails
          }
          const options = { day: '2-digit', month: 'short', year: 'numeric' };
          return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
      } catch (e) {
          console.warn("Error formatting date string:", dateValue, e);
          return dateValue; // Return original if error occurs
      }
  }
  // If it's already a Date object, format it
  if (dateValue instanceof Date) {
      if (isNaN(dateValue.getTime())) return ""; // Handle invalid Date objects
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return dateValue.toLocaleDateString('en-GB', options).replace(/ /g, '-');
  }
  return String(dateValue); // Fallback for other types
}


function fetchVendorData() {
  fetch("/.netlify/functions/vendor-data")
    .then(res => res.json())
    .then(rawData => { // rawData is now the 2D array from the Apps Script with filtered columns and unique headers
      if (!rawData || rawData.length === 0) {
        console.warn("No data received from vendor-data API or data is empty.");
        document.getElementById("product-rows").innerHTML = "<tr><td colspan='16'>No workorder data available.</td></tr>";
        return;
      }

      const newHash = JSON.stringify(rawData);
      if (newHash === lastDataHash) return; // Prevent unnecessary re-render if data is the same
      lastDataHash = newHash;

      const headers = rawData[0]; // First row is the new, unique headers
      const dataRows = rawData.slice(1); // Rest are data rows

      const headerMap = new Map();
      headers.forEach((header, index) => headerMap.set(header.trim(), index));

      const output = [];

      dataRows.forEach(row => {
        // Map common properties using the headerMap
        const base = {
          opportunityId: row[headerMap.get("Opp Id")],
          product: row[headerMap.get("Product")],
          variant: row[headerMap.get("Variant")],
          imageUrl: row[headerMap.get("Public Image URL (Auto)")] || '',
          category: row[headerMap.get("Category (Auto)")],
          materialSummary: row[headerMap.get("Summary of Materials (Auto)")],
          size: row[headerMap.get("Size (inches) (Auto)")],
          folderLink: row[headerMap.get("Folder on Drive (Auto)")],
          designer: row[headerMap.get("Designer (Auto)")],
          designerLink: row[headerMap.get("Designer Link (Auto)")],
          quantity: row[headerMap.get("Quantity")],
          pm: row[headerMap.get("PM (Auto)")],
        };

        // Iterate through all 8 possible vendor slots to find relevant data
        for (let j = 1; j <= 8; j++) {
          const currentVendorHeader = `Vendor ${j}`;
          const currentReadyHeader = `Vendor ${j} Ready to Ship?`;

          const vendorColIndex = headerMap.get(currentVendorHeader);
          const readyColIndex = headerMap.get(currentReadyHeader);

          if (vendorColIndex !== undefined && readyColIndex !== undefined) {
              const currentVendor = row[vendorColIndex];
              const ready = row[readyColIndex];

              // Filter for the specific vendor requested in the URL and not ready to ship
              if (currentVendor && String(currentVendor).trim() !== "" && ready !== true) {
                const trimmedCurrentVendor = String(currentVendor).trim();
                if (!vendorName || vendorName === trimmedCurrentVendor) {
                  // Get vendor-specific details using unique headers
                  const entry = {
                    ...base, // Spread the base properties
                    vendor: trimmedCurrentVendor,
                    taskAssignedOn: formatDate(row[headerMap.get(`Vendor ${j} Task Assigned On`)]),
                    committedFinishDate: formatDate(row[headerMap.get(`Vendor ${j} Committed Finish Date`)]),
                    actualFinishDate: formatDate(row[headerMap.get(`Vendor ${j} Actual Finish Date`)]),
                    remarks: row[headerMap.get(`Vendor ${j} Remarks`)] || "",
                    readyToShip: ready
                  };
                  output.push(entry);
                }
              }
          }
        }
      });

      const tbody = document.getElementById("product-rows");
      tbody.innerHTML = ""; // Clear previous content

      // Sort the filtered output
      const filteredAndSorted = output
        .sort((a, b) => {
          const d1 = parseDate(a.committedFinishDate);
          const d2 = parseDate(b.committedFinishDate);
          return d1 - d2;
        });

      if (filteredAndSorted.length === 0) {
        tbody.innerHTML = "<tr><td colspan='16'>No active workorders for this vendor.</td></tr>";
        return;
      }

      filteredAndSorted.forEach((d, index) => {
        const tr = document.createElement("tr");

        const srCell = document.createElement("td");
        srCell.textContent = index + 1; // Serial number based on filtered list
        tr.appendChild(srCell);

        const img = new Image();
        img.src = d.imageUrl;
        img.className = "thumbnail";
        img.loading = "lazy";
        img.onload = () => img.classList.add("loaded");

        const link = document.createElement("a");
        link.href = d.imageUrl;
        link.target = "_blank";
        link.appendChild(img);

        const wrapper = document.createElement("div");
        wrapper.className = "image-wrapper";
        wrapper.appendChild(link);

        const imgCell = document.createElement("td");
        imgCell.appendChild(wrapper);
        tr.appendChild(imgCell);

        // Columns for the HTML table, ensure they match your vendor.html <thead> order
        const columns = [
          d.product,
          d.variant,
          d.category,
          d.materialSummary,
          d.size,
          d.opportunityId,
          `<a href="${d.folderLink}" target="_blank">Folder</a>`,
          d.designer,
          `<a href="${d.designerLink}" target="_blank">Link</a>`, // Using designerLink for drawing link
          d.quantity,
          d.remarks, // This is the vendor-specific remarks
          d.taskAssignedOn,
          d.committedFinishDate,
          d.pm
        ];

        columns.forEach(content => {
          const td = document.createElement("td");
          td.innerHTML = content || ""; // Ensure empty strings for null/undefined
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });
    })
    .catch(error => {
      console.error("Error fetching or processing vendor data:", error);
      document.getElementById("product-rows").innerHTML = "<tr><td colspan='16'>Error loading vendor data. Please try again later.</td></tr>";
    });
}

// Initial fetch when the page loads
fetchVendorData();

// Refresh data every 10 seconds (adjust as needed)
setInterval(fetchVendorData, 10000);