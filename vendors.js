fetch("https://raw.githubusercontent.com/ub1qu1tous/vendor-dashboard/main/data/latest.json")
  .then(res => res.json())
  .then(data => {
    const vendors = data.vendors || {};
    const tableBody = document.getElementById("vendor-table-body");
    if (tableBody) tableBody.innerHTML = "";

    const vendorIndex = document.getElementById("vendor-index");
    if (vendorIndex) vendorIndex.innerHTML = "";

    const vendorEntries = Object.entries(vendors).sort();

    vendorEntries.forEach(([vendorKey, records]) => {
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

    if (vendorEntries.length === 0) {
      if (vendorIndex) vendorIndex.innerHTML = `<p>No vendor data found.</p>`;
      if (tableBody) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="2">No vendor data found.</td>`;
        tableBody.appendChild(tr);
      }
    }

    // document.getElementById("title").innerHTML = "Vendor Order List " + "(" + ordercount + ")";
    document.getElementById("title").innerHTML = "Vendor Order List ";
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
