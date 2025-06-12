fetch("https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/vendors.json")
  .then(res => res.json())
  .then(data => {
    const vendorMap = {}; // key: vendorKey, value: { displayName, count }

    Object.entries(data || {}).forEach(([vendorKey, entries]) => {
      let count = 0;
      let displayName = vendorKey.replace(/_/g, ' '); // fallback name

      Object.values(entries || {}).forEach(entry => {
        if (entry.vendorDisplayName) {
          displayName = entry.vendorDisplayName; // use explicit display name if present
        }

        if (entry.v?.rts === false) {
          count += 1;
        }
      });

      if (count > 0) {
        vendorMap[vendorKey] = { displayName, count };
      }
    });

    const container = document.getElementById("vendor-index");
    container.innerHTML = "";

    Object.entries(vendorMap)
      .sort((a, b) => a[1].displayName.localeCompare(b[1].displayName))
      .forEach(([vendorKey, { displayName, count }]) => {
        const link = document.createElement("a");
        link.href = `vendor.html?vendor=${encodeURIComponent(vendorKey)}`;
        link.textContent = `${displayName} (${count})`;
        container.appendChild(link);
      });
  })
  .catch(err => {
    console.error("Error fetching vendor list:", err);
    document.getElementById("vendor-index").textContent = "Failed to load vendor index.";
  });
