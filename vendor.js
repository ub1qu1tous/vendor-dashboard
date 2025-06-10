const params = new URLSearchParams(window.location.search);
const vendorName = params.get("vendor");
document.getElementById("vendor-name").textContent = vendorName;

let lastDataHash = "";

// Helper function to normalize a single row from 2D array to an object
function normalizeRow(row, headers) {
  const headerMap = new Map();
  headers.forEach((header, index) => headerMap.set(header.trim(), index)); // Trim headers for consistent mapping

  // Map raw column data to meaningful property names using exact headers from echo.json
  const base = {
    opportunityId: row[headerMap.get("Opp Id")],
    product: row[headerMap.get("Product")],
    variant: row[headerMap.get("Variant")],
    imageUrl: row[headerMap.get("Public Image URL (Auto)")] || '', // Use exact header
    category: row[headerMap.get("Category (Auto)")], // Use exact header
    materialSummary: row[headerMap.get("Summary of Materials (Auto)")], // Use exact header
    size: row[headerMap.get("Size (inches) (Auto)")], // Use exact header
    folderLink: row[headerMap.get("Folder on Drive (Auto)")], // Use exact header
    designer: row[headerMap.get("Designer (Auto)")], // Use exact header
    designerLink: row[headerMap.get("Designer Link (Auto)")], // Use exact header
    quantity: row[headerMap.get("Quantity")],
    pm: row[headerMap.get("PM (Auto)")], // Use exact header
    // Removed rowNumber as it's not a direct column in echo.json and seems derived
  };

  return base;
}

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


function fetchVendorData() {
  fetch("/.netlify/functions/vendor-data")
    .then(res => res.json())
    .then(rawData => { // rawData is now the 2D array from the sheet
      if (!rawData || rawData.length === 0) {
        console.warn("No data received from vendor-data API.");
        return;
      }

      const newHash = JSON.stringify(rawData);
      if (newHash === lastDataHash) return;
      lastDataHash = newHash;

      const headers = rawData[0]; // First row is headers
      const dataRows = rawData.slice(1); // Rest are data rows

      const headerMap = new Map();
      headers.forEach((header, index) => headerMap.set(header.trim(), index));

      const output = [];
      const vendorStartCol = 20; // As per original Apps Script
      const vendorBlockSize = 6;  // As per original Apps Script
      const vendorSlots = 8;      // As per original Apps Script

      dataRows.forEach(row => {
        const base = normalizeRow(row, headers); // Get the common base properties for the row

        for (let j = 0; j < vendorSlots; j++) {
          const offset = vendorStartCol + j * vendorBlockSize;
          const vendor = row[offset];
          const ready = row[offset + 5];

          if (vendor && String(vendor).trim() !== "" && ready !== true) {
            const currentVendorName = String(vendor).trim(); // Normalize vendor name
            if (!vendorName || vendorName === currentVendorName) { // Filter by URL vendorName or include all if no query
              const entry = {
                ...base, // Spread the base properties
                vendor: currentVendorName,
                taskAssignedOn: formatDate(row[offset + 1]),
                committedFinishDate: formatDate(row[offset + 2]),
                actualFinishDate: formatDate(row[offset + 3]),
                remarks: row[offset + 4],
                readyToShip: ready
              };
              output.push(entry);
            }
          }
        }
      });

      const tbody = document.getElementById("product-rows");
      tbody.innerHTML = "";

      const filteredAndSorted = output
        .sort((a, b) => {
          const d1 = parseDate(a.committedFinishDate);
          const d2 = parseDate(b.committedFinishDate);
          return d1 - d2;
        });

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
          d.remarks,
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
      // Display a user-friendly error message if needed
      document.getElementById("product-rows").innerHTML = "<tr><td colspan='16'>Error loading vendor data. Please try again later.</td></tr>";
    });
}

// This function assumes the date is already in the 'DD-Mon-YYYY' string format
// coming from the Google Sheet. If it's a Date object, you might need to format it.
function formatDate(dateValue) {
  return dateValue;
}

fetchVendorData();