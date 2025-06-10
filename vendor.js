const params = new URLSearchParams(window.location.search);
const vendorName = params.get("vendor");
document.getElementById("vendor-name").textContent = vendorName;

let lastDataHash = "";

function fetchVendorData() {
  fetch(`https://script.google.com/macros/s/AKfycbx0IVl18EoVAeW0GYHtnHuNHRlJYjhXPkVij59-RbW7EI2MjcW1HHKYEApyj96_5-Bu/exec?vendor=${encodeURIComponent(vendorName)}`)
    .then(res => res.json())
    .then(data => {
      const newHash = JSON.stringify(data);
      if (newHash === lastDataHash) return;
      lastDataHash = newHash;

      const tbody = document.getElementById("product-rows");
      tbody.innerHTML = "";

      const filtered = data
        .filter(d => d.vendor === vendorName)
        .sort((a, b) => {
          const d1 = parseDate(a.committedFinishDate);
          const d2 = parseDate(b.committedFinishDate);
          return d1 - d2;
        });

      filtered.forEach((d, index) => {
        const tr = document.createElement("tr");

        const srCell = document.createElement("td");
        srCell.textContent = index + 1;
        tr.appendChild(srCell);

        const img = new Image();
        img.src = d.imageUrl;
        img.className = "thumbnail";
        img.loading = "lazy";
        img.onload = () => img.classList.add("loaded");

        const link = document.createElement("a");
        link.href = d.imageUrl;
        link.target = "_blank";
        link.appendChild(img);

        const wrapper = document.createElement("div");
        wrapper.className = "image-wrapper";
        wrapper.appendChild(link);

        const imgCell = document.createElement("td");
        imgCell.appendChild(wrapper);
        tr.appendChild(imgCell);

        const columns = [
          d.product,
          d.variant,
          d.category,
          d.materialSummary,
          d.size,
          d.opportunityId,
          `<a href="${d.folderLink}" target="_blank">Folder</a>`,
          d.designer,
          `<a href="${d.drawingLink}" target="_blank">Link</a>`,
          d.quantity,
          d.remarks,
          d.taskAssignedOn,
          d.committedFinishDate,
          d.pm
        ];

        columns.forEach(content => {
          const td = document.createElement("td");
          td.innerHTML = content || "";
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });
    });
}

function parseDate(dateStr) {
  if (!dateStr) return new Date(9999, 11, 31);
  const [day, monthStr, year] = dateStr.split('-');
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  return new Date(parseInt(year), months[monthStr], parseInt(day));
}

fetchVendorData();
setInterval(fetchVendorData, 10000);
