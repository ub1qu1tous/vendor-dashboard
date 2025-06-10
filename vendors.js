function fetchVendorList() {
  fetch("/.netlify/functions/vendor-data")
    .then(res => res.json())
    .then(data => {
      const vendorMap = {};
      data.forEach(item => {
        if (!vendorMap[item.vendor]) {
          vendorMap[item.vendor] = 0;
        }
        vendorMap[item.vendor]++;
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
}

fetchVendorList();
