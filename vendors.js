let allVendorEntries = [];

function renderVendorIndex(entries) {
  const tableBody = document.getElementById("vendor-table-body");
  if (tableBody) tableBody.innerHTML = "";

  const vendorIndex = document.getElementById("vendor-index");
  if (vendorIndex) vendorIndex.innerHTML = "";

  entries.forEach(([vendorKey, records]) => {
    const vendorDisplayName = records[0]?.vendorDisplayName || vendorKey;
    const totalOrders = records.length;

    const a = document.createElement("a");
    a.href = `vendor.html?vendor=${encodeURIComponent(vendorKey)}`;
    a.textContent = `${vendorDisplayName} (${totalOrders})`;
    if (vendorIndex) vendorIndex.appendChild(a);

    if (tableBody) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><a href="vendor.html?vendor=${encodeURIComponent(vendorKey)}">${vendorDisplayName}</a></td>
        <td>${totalOrders}</td>
      `;
      tableBody.appendChild(tr);
    }
  });

  if (entries.length === 0) {
    if (vendorIndex) vendorIndex.innerHTML = `<p>No vendors match your search.</p>`;
    if (tableBody) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="2">No vendors match your search.</td>`;
      tableBody.appendChild(tr);
    }
  }
}

fetch("https://raw.githubusercontent.com/ub1qu1tous/vendor-dashboard/main/data/latest.json")
  .then(res => res.json())
  .then(data => {
    const vendors = data.vendors || {};
    allVendorEntries = Object.entries(vendors).sort();

    renderVendorIndex(allVendorEntries);

    document.getElementById("title").innerHTML = "Vendor Order List ";

    const searchInput = document.getElementById("vendor-search");
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        const term = e.target.value.trim().toLowerCase();
        debounceTimer = setTimeout(() => {
          const filtered = allVendorEntries.filter(([vendorKey, records]) => {
            const displayName = (records[0]?.vendorDisplayName || vendorKey).toLowerCase();
            return displayName.includes(term);
          });
          renderVendorIndex(filtered);
        }, 150);
      });
    }
  })
  .catch(error => {
    console.error("Error loading vendors:", error);
    const vendorIndex = document.getElementById("vendor-index");
    if (vendorIndex) vendorIndex.innerHTML = `<p>Error loading vendor data.</p>`;
    const tableBody = document.getElementById("vendor-table-body");
    if (tableBody) {
      tableBody.innerHTML = `<tr><td colspan="2">Error loading vendor data.</td></tr>`;
    }
  });