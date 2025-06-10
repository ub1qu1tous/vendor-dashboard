document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const vendorName = params.get("vendor");
    document.getElementById("vendor-name").textContent = vendorName;

    let lastDataHash = "";

    // Helper function to parse dates for sorting
    function parseDate(dateStr) {
        if (!dateStr) return new Date(9999, 11, 31); // Return a far future date for null/empty
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
            console.warn(`Invalid date string encountered during parsing: ${dateStr}`);
            return new Date(9999, 11, 31); // Return a far future date for invalid dates
        }

        return new Date(parsedYear, parsedMonth, parsedDay);
    }

    // Helper function to format dates from Google Sheets (which might be ISO strings initially for the Apps Script)
    // Note: This function is also duplicated in the Apps Script for server-side formatting
    function formatDate(dateValue) {
        if (!dateValue) return "";
        const date = new Date(dateValue);
        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.warn(`Invalid date value encountered during formatting: ${dateValue}`);
            return "";
        }
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    }

    function fetchVendorData() {
        fetch("echo.json")
        // fetch("https://script.google.com/macros/s/AKfycbx3xTvOX8viwPOdGcKE-eYwgDUN-y5ImLwXeMYW3xDlnftU3u7763KsgLj7FzbUctWT/exec")
            .then(res => res.json())
            .then(data => {
                const newHash = JSON.stringify(data);
                if (newHash === lastDataHash) return;
                lastDataHash = newHash;

                const tbody = document.getElementById("product-rows");
                tbody.innerHTML = "";

                const filtered = data
                    .filter(d => d.vendor === vendorName)
                    .sort((a, b) => {
                        const d1 = parseDate(a.committedFinishDate);
                        const d2 = parseDate(b.committedFinishDate);
                        return d1 - d2;
                    });

                filtered.forEach((d, index) => {
                    const tr = document.createElement("tr");

                    const srCell = document.createElement("td");
                    srCell.textContent = index + 1;
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
                    // These properties directly map to the object keys returned by the Apps Script doGet
                    const columns = [
                        d.product,
                        d.variant,
                        d.category,
                        d.materialSummary,
                        d.size,
                        d.opportunityId,
                        `<a href=\"${d.folderLink}\" target=\"_blank\">Folder</a>`,
                        d.designer,
                        `<a href=\"${d.designerLink}\" target=\"_blank\">Link</a>`, // Using designerLink for drawing link
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
});