fetch("https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/.json")
  .then(res => res.json())
  .then(data => {
    const records = Object.values(data || {});
    const vendorMap = {};

    records.forEach(entry => {
      (entry.vendors || []).forEach(v => {
        const name = v.vendor?.trim();
        if (name && v.readyToShip === false) {
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
  });
