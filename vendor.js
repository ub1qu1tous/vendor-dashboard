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
        const vendorDisplayName = Object.values(data)[0].vendorDisplayName;
        document.title = vendorDisplayName;
        document.getElementById("vendor-name").textContent = vendorDisplayName;

        // const allRecords = Object.entries(data || {}).map(([key, entry]) => {
        //   entry.key = key;
        //   return entry;
        // });

        const allRecords = Object.entries(data || {}).map(([key, entry]) => {
          return { ...(entry || {}), key };
        });

        const filtered = allRecords;

        const tbody = document.getElementById("product-rows");
        tbody.innerHTML = "";

        const mobileList = document.getElementById("product-list");
        if (mobileList) mobileList.innerHTML = "";

        filtered
          .sort((a, b) => parseDate(a.v?.c) - parseDate(b.v?.c))
          .forEach((d, index) => {
            const isDue = d.v?.c && parseDate(d.v.c) <= new Date();
            const dateCellStyle = isDue ? 'style="background: #E06666; color: white;"' : '';
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${index + 1}</td>
              <td ${dateCellStyle}>${d.v?.c || ''}</td>
              <td>${d.op || ''}</td>
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
              <td>${d.cr || ''}</td>
              <td>${d.v?.rm || ''}</td>
              <td>${d.pm || ''}</td>
              <td><a href="${d.fld}" target="_blank">Folder</a></td>
              <td>${d.dl && d.dl.startsWith('http') ? `<a href="${d.dl}" target="_blank">${d.des || ''}</a>` : `${d.des || ''}`}</td>
              <td>${d.q || ''}</td>
              <td>${d.v?.t || ''}</td>
            `;
            tbody.appendChild(tr);

            if (mobileList) {
              const card = document.createElement("div");
              card.className = "product-card";
              card.innerHTML = `
                <img src="${d.url || ''}" alt="Product Image" class="thumbnail">
                <h3>${d.prod || ''} ${d.var || ''}</h3>
                <p>Committed Finish Date: ${d.v?.c || 'N/A'}</p>
              `;
              card.addEventListener('click', () => showProductDetail(vendorKey, d.key));
              mobileList.appendChild(card);
            }
          });
      })
      .catch(error => {
        console.error("Error fetching vendor data:", error);
        document.getElementById("product-rows").innerHTML = `
          <tr><td colspan="16">Error loading vendor data. Please try again later.</td></tr>`;
      });
  }

  fetchVendorData();
});

function cleanKey(input) {
  return (input || "").toString().trim().toLowerCase();
}

function showProductDetail(vendorKey, entryKey) {
  fetch(`https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/vendors/${vendorKey}/${entryKey}.json`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("product-detail");
      container.innerHTML = `
        <h2>${data.prod} ${data.var}</h2>
        <img src="${data.url || ''}" class="thumbnail" alt="Product Image">
        <p><strong>Category:</strong> ${data.cat || ''}</p>
        <p><strong>Material:</strong> ${data.mat || ''}</p>
        <p><strong>Size:</strong> ${data.sz || ''}</p>
        <p><strong>Committed Finish Date:</strong> ${data.v?.c || ''}</p>
        <p><strong>PM:</strong> ${data.pm || ''}</p>
        <p><strong>Designer:</strong> ${data.des || ''}</p>
        <p><strong>Quantity:</strong> ${data.q || ''}</p>
        <p><strong>Remarks:</strong> ${data.v?.rm || ''}</p>
        <a href="${data.fld}" target="_blank">Product Folder</a><br>
        <a href="${data.dl}" target="_blank">Drawing Files</a>
      `;
      document.getElementById("product-modal").classList.remove("hidden");
    });
}

document.addEventListener('click', function (e) {
  if (e.target.matches('.close-button') || e.target.matches('#product-modal')) {
    document.getElementById("product-modal").classList.add("hidden");
  }
});
