function fetchVendorList() {
  fetch("https://script.google.com/macros/s/AKfycbx0IVl18EoVAeW0GYHtnHuNHRlJYjhXPkVij59-RbW7EI2MjcW1HHKYEApyj96_5-Bu/exec")
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
setInterval(fetchVendorList, 10000);
