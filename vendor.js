document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const vendorName = params.get("vendor");
    document.getElementById("vendor-name").textContent = vendorName;

    let lastDataHash = "";

    function parseDate(dateStr) {
        if (!dateStr) return new Date(9999, 11, 31);
        const [day, monthStr, year] = String(dateStr).split('-');
        const months = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };
        const parsedDay = parseInt(day);
        const parsedYear = parseInt(year);
        const parsedMonth = months[monthStr];
        if (isNaN(parsedDay) || isNaN(parsedYear) || parsedMonth === undefined) {
            return new Date(9999, 11, 31);
        }
        return new Date(parsedYear, parsedMonth, parsedDay);
    }

    function formatDate(dateValue) {
        if (!dateValue) return "";
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return "";
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    }

    function fetchVendorData() {
        fetch("https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/products.json")
            .then(res => res.json())
            .then(data => {
                const list = Object.values(data || {});
                const newHash = JSON.stringify(list);
                if (newHash === lastDataHash) return;
                lastDataHash = newHash;

                const tbody = document.getElementById("product-rows");
                tbody.innerHTML = "";

                const filtered = list
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
                        `<a href="${d.designerLink}" target="_blank">Link</a>`,
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
            })
            .catch(error => {
                console.error("Error fetching or processing vendor data:", error);
                document.getElementById("product-rows").innerHTML = "<tr><td colspan='16'>Error loading vendor data. Please try again later.</td></tr>";
            });
    }

    fetchVendorData();
    setInterval(fetchVendorData, 10000);
});
