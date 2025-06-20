document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const vendorName = params.get("vendor") || "";
  const vendorKey = cleanKey(vendorName);

  function cleanKey(input) {
    return (input || "").toString().trim().toLowerCase();
  }

  fetch(`https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/vendors/${encodeURIComponent(vendorKey)}.json`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("product-list");
      const vendorDisplayName = Object.values(data)[0].vendorDisplayName || vendorName;
      document.getElementById("vendor-name").textContent = vendorDisplayName;

      Object.entries(data || {}).forEach(([entryKey, entry]) => {
        if (!entry.prod) return;
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
          <img src="${entry.url || ''}" alt="Product Image" class="thumbnail">
          <h3>${entry.prod} ${entry.var}</h3>
          <p>Committed Date: ${entry.v?.c || 'N/A'}</p>
          <a href="product.html?vendor=${vendorKey}&id=${entryKey}">View Details</a>
        `;
        container.appendChild(card);
      });
    });
});
