document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const vendorName = params.get("vendor");
  document.getElementById("vendor-name").textContent = vendorName;

  function parseDate(dateStr) {
    if (!dateStr) return new Date(9999, 11, 31);
    const [day, monthStr, year] = String(dateStr).split('-');
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const parsedDay = parseInt(day);
    const parsedYear = parseInt(year);
    const parsedMonth = months[monthStr];
    return (isNaN(parsedDay) || isNaN(parsedYear) || parsedMonth === undefined)
      ? new Date(9999, 11, 31)
      : new Date(parsedYear, parsedMonth, parsedDay);
  }

  function fetchVendorData() {
    fetch("https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/.json")
      .then(res => res.json())
      .then(data => {
        const allRecords = Object.values(data || {});
        const filtered = [];

        allRecords.forEach(entry => {
          (entry.vendors || []).forEach(v => {
            if (v.vendor === vendorName && v.readyToShip !== true) {
              filtered.push({
                ...entry,
                ...v
              });
            }
          });
        });

        const tbody = document.getElementById("product-rows");
        tbody.innerHTML = "";

        filtered
          .sort((a, b) => parseDate(a.committedFinishDate) - parseDate(b.committedFinishDate))
          .forEach((d, index) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
              <td>${index + 1}</td>
              <td><div class="image-wrapper"><a href="${d.imageUrl}" target="_blank"><img src="${d.imageUrl}" class="thumbnail" loading="lazy"></a></div></td>
              <td>${d.product || ''}</td>
              <td>${d.variant || ''}</td>
              <td>${d.category || ''}</td>
              <td>${d.materialSummary || ''}</td>
              <td>${d.size || ''}</td>
              <td>${d.opportunityId || ''}</td>
              <td><a href="${d.folderLink}" target="_blank">Folder</a></td>
              <td>${d.designer || ''}</td>
              <td><a href="${d.designerLink}" target="_blank">Link</a></td>
              <td>${d.quantity || ''}</td>
              <td>${d.remarks || ''}</td>
              <td>${d.taskAssignedOn || ''}</td>
              <td>${d.committedFinishDate || ''}</td>
              <td>${d.pm || ''}</td>
            `;

            tbody.appendChild(tr);
          });
      })
      .catch(error => {
        console.error("Error fetching vendor data:", error);
        document.getElementById("product-rows").innerHTML = `
          <tr><td colspan="16">Error loading vendor data. Please try again later.</td></tr>`;
      });
  }

  fetchVendorData();
  setInterval(fetchVendorData, 10000); // Refresh every 10s
});
