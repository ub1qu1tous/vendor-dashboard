document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const vendorKey = params.get("vendor") || "";
  const entryKey = params.get("id");

  if (!vendorKey || !entryKey) {
    document.getElementById("product-detail").innerHTML = "<p>Invalid product reference.</p>";
    return;
  }

  fetch(`https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/vendors/${vendorKey}/${entryKey}.json`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("product-detail");
      container.innerHTML = `
        <h1>${data.prod} ${data.var}</h1>
        <img src="${data.url || ''}" class="thumbnail" alt="Product Image">
        <p><strong>Category:</strong> ${data.cat || ''}</p>
        <p><strong>Material:</strong> ${data.mat || ''}</p>
        <p><strong>Size:</strong> ${data.sz || ''}</p>
        <p><strong>Committed Finish Date:</strong> ${data.v?.c || ''}</p>
        <p><strong>Project Manager:</strong> ${data.pm || ''}</p>
        <p><strong>Designer:</strong> ${data.des || ''}</p>
        <p><strong>Quantity:</strong> ${data.q || ''}</p>
        <p><strong>Remarks:</strong> ${data.v?.rm || ''}</p>
        <p><a href="${data.fld}" target="_blank">Product Files</a></p>
        <p><a href="${data.dl}" target="_blank">Drawing Files</a></p>
      `;
    });
});
