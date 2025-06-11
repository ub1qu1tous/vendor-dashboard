document.addEventListener('DOMContentLoaded', function() {
    function fetchVendorList() {
        fetch("https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/products.json")
            .then(res => res.json())
            .then(data => {
                const list = Object.values(data || {});
                if (list.length === 0) {
                    document.getElementById("vendor-index").innerHTML = "<p>No vendor data available.</p>";
                    return;
                }

                const vendorMap = {};
                list.forEach(item => {
                    if (item.vendor && item.vendor.trim() !== "") {
                        const vendorName = item.vendor.trim();
                        vendorMap[vendorName] = (vendorMap[vendorName] || 0) + 1;
                    }
                });

                const container = document.getElementById("vendor-index");
                container.innerHTML = "";

                if (Object.keys(vendorMap).length === 0) {
                    container.innerHTML = "<p>No active vendors found.</p>";
                } else {
                    Object.keys(vendorMap).sort().forEach(vendor => {
                        const link = document.createElement("a");
                        link.href = `vendor.html?vendor=${encodeURIComponent(vendor)}`;
                        link.textContent = `${vendor} (${vendorMap[vendor]})`;
                        container.appendChild(link);
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching or processing vendor list data:", error);
                document.getElementById("vendor-index").innerHTML = "<p>Error loading vendor list. Please try again later.</p>";
            });
    }

    fetchVendorList();
    setInterval(fetchVendorList, 10000);
});
