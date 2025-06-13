document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const vendorName = params.get("vendor") || "";
  const vendorKey = cleanKey(vendorName);

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
    fetch(`https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/vendors/${encodeURIComponent(vendorKey)}.json`)
      .then(res => res.json())
      .then(data => {
        document.title = Object.values(data)[0].vendorDisplayName;
        document.getElementById("vendor-name").textContent = Object.values(data)[0].vendorDisplayName;
        const allRecords = Object.values(data || {});
        const filtered = allRecords.filter(entry => entry.v?.rts === false);

        const tbody = document.getElementById("product-rows");
        tbody.innerHTML = "";

        filtered
          .sort((a, b) => parseDate(a.v?.c) - parseDate(b.v?.c))
          .forEach((d, index) => {
            const isDue = d.v?.c && parseDate(d.v.c) <= new Date();
            const dateCellStyle = isDue ? 'style="background: #E06666; color: white;"' : '';
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${index + 1}</td>
              <td ${dateCellStyle}>${d.v?.c || ''}</td>
              <td>
                <div class="image-wrapper">
                  ${d.url ? `<a href="${d.url}" target="_blank"><img src="${d.url}" class="thumbnail" loading="lazy" referrerpolicy="no-referrer" alt="product image"></a>` : `<span>No image</span>`}
                </div>
              </td>
              <td>${d.prod || ''}</td>
              <td>${d.var || ''}</td>
              <td>${d.cat || ''}</td>
              <td>${d.mat || ''}</td>
              <td>${d.sz || ''}</td>
              <td>${d.op || ''}</td>
              <td>${d.pm || ''}</td>
              <td><a href="${d.fld}" target="_blank">Folder</a></td>
              <td>${d.dl && d.dl.startsWith('http') ? `<a href="${d.dl}" target="_blank">${d.des || ''}</a>` : `${d.des || ''}`}</td>
              <td>${d.q || ''}</td>
              <td>${d.v?.rm || ''}</td>
              <td>${d.v?.t || ''}</td>
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
//   setInterval(fetchVendorData, 10000); // Refresh every 10s
});

function cleanKey(input) {
  return (input || "")
    .toString()
    .trim()
    .toLowerCase();
}
