fetch("https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/vendors.json")
  .then(res => res.json())
  .then(data => {
    const vendorMap = {};

    Object.entries(data || {}).forEach(([vendorKey, entries]) => {
      Object.values(entries || {}).forEach(entry => {
        const name = entry.vendorDisplayName || vendorKey.replace(/_/g, ' ');
        if (entry.v?.rts === false) {
          vendorMap[name] = (vendorMap[name] || 0) + 1;
        }
      });
    });

    const container = document.getElementById("vendor-index");
    container.innerHTML = "";

    Object.keys(vendorMap).sort().forEach(vendor => {
      const link = document.createElement("a");
      link.href = `vendor.html?vendor=${encodeURIComponent(vendor)}`;
      link.textContent = `${vendor} (${vendorMap[vendor]})`;
      container.appendChild(link);
    });
  })
  .catch(err => {
    console.error("Error fetching vendor list:", err);
    document.getElementById("vendor-index").textContent = "Failed to load vendor index.";
  });
