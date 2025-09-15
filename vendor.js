// document.addEventListener('DOMContentLoaded', function () {
//   const params = new URLSearchParams(window.location.search);
//   const vendorName = params.get("vendor") || "";
//   const vendorKey = cleanKey(vendorName);

//   function parseDate(dateStr) {
//     if (!dateStr) return new Date(9999, 11, 31);
//     const [day, monthStr, year] = String(dateStr).split('-');
//     const months = {
//       Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
//       Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
//     };
//     const parsedDay = parseInt(day);
//     const parsedYear = parseInt(year);
//     const parsedMonth = months[monthStr];
//     return (isNaN(parsedDay) || isNaN(parsedYear) || parsedMonth === undefined)
//       ? new Date(9999, 11, 31)
//       : new Date(parsedYear, parsedMonth, parsedDay);
//   }

//   function fetchVendorData() {
//     // fetch(`https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/vendors/${encodeURIComponent(vendorKey)}.json`)
//     fetch(`https://raw.githubusercontent.com/ub1qu1tous/vendor-dashboard/main/data/latest.json`)
//     .then(res => res.json())
//       .then(data => {
//         const vendorDisplayName = Object.values(data)[0].vendorDisplayName;
//         document.title = vendorDisplayName + " - Vendor Order List";
//         document.getElementById("vendor-name").textContent = vendorDisplayName;

//         // const allRecords = Object.entries(data || {}).map(([key, entry]) => {
//         //   entry.key = key;
//         //   return entry;
//         // });

//         const allRecords = Object.entries(data || {}).map(([key, entry]) => {
//           return { ...(entry || {}), key };
//         });

//         const filtered = allRecords;

//         const tbody = document.getElementById("product-rows");
//         tbody.innerHTML = "";

//         const mobileList = document.getElementById("product-list");
//         if (mobileList) mobileList.innerHTML = "";

//         filtered
//           .sort((a, b) => parseDate(a.v?.c) - parseDate(b.v?.c))
//           .forEach((d, index) => {

//             const today = new Date();
//             const committedDate = parseDate(d.v?.c);
//             let dateCellStyle = '';
//             let dateTextStyle = '';

//             if (d.v?.c) {
//               const diffInDays = Math.ceil((committedDate - today) / (1000 * 60 * 60 * 24));

//               if (diffInDays <= 0) {
//                 dateCellStyle = 'style="background: #E06666; color: white;"'; // For table cell
//                 dateTextStyle = 'style="background: #E06666; color: black; padding: 0 5px; border-radius: 5px"'; // Red for mobile
//               } else if (diffInDays < 3) {
//                 dateCellStyle = 'style="background: #FFD966; color: #333;"'; // Yellow in table
//                 dateTextStyle = 'style="background: #FFD966; color: black; padding: 0 5px; border-radius: 5px"'; // Yellow text for mobile
//               }
//             }


//             const tr = document.createElement("tr");
//             tr.innerHTML = `
//               <td>${index + 1}</td>
//               <td ${dateCellStyle}>${d.v?.c || ''}</td>
//               <td>${d.op || ''}</td>
//               <td>
//                 <div class="image-wrapper">
//                   ${d.url ? `<a href="${d.url}" target="_blank"><img src="${d.url}" class="thumbnail" loading="lazy" referrerpolicy="no-referrer" alt="product image"></a>` : `<span>No image</span>`}
//                 </div>
//               </td>
//               <td>${d.prod || ''}</td>
//               <td>${d.var || ''}</td>
//               <td>${d.cat || ''}</td>
//               <td>${d.mat || ''}</td>
//               <td>${d.sz || ''}</td>
//               <td>${d.cr || ''}</td>
//               <td>${d.v?.rm || ''}</td>
//               <td>${d.pm || ''}</td>
//               <td><a href="${d.fld}" target="_blank">Folder</a></td>
//               <td>${d.dl && d.dl.startsWith('http') ? `<a href="${d.dl}" target="_blank">${d.des || ''}</a>` : `${d.des || ''}`}</td>
//               <td>${d.q || ''}</td>
//               <td>${d.v?.t || ''}</td>
//             `;
//             tbody.appendChild(tr);

//             if (mobileList) {
//               const card = document.createElement("div");
//               card.className = "product-card";
//               card.innerHTML = `
//                 <img src="${d.url || ''}" alt="Product Image" class="thumbnail">
//                 <h3>${d.prod || ''} ${d.var || ''}</h3>
//                 <p>Committed Finish Date: <span id> <span ${dateTextStyle}>${d.v?.c || 'N/A'}</span></p>
//               `;
//               card.addEventListener('click', () => showProductDetail(vendorKey, d.key));
//               mobileList.appendChild(card);
//             }
//           });
//       })
//       .catch(error => {
//         console.error("Error fetching vendor data:", error);
//         document.getElementById("product-rows").innerHTML = `
//           <tr><td colspan="16">Error loading vendor data. Please try again later.</td></tr>`;
//       });
//   }

//   fetchVendorData();
// });

// function cleanKey(input) {
//   return (input || "").toString().trim().toLowerCase();
// }

// function showProductDetail(vendorKey, entryKey) {
//   fetch(`https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/vendors/${vendorKey}/${entryKey}.json`)
//     .then(res => res.json())
//     .then(data => {
//       const container = document.getElementById("product-detail");
//       container.innerHTML = `
//         <h2>${data.prod} ${data.var}</h2>
//         <img src="${data.url || ''}" class="thumbnail" alt="Product Image">
//         <p><strong>Category:</strong> ${data.cat || ''}</p>
//         <p><strong>Material:</strong> ${data.mat || ''}</p>
//         <p><strong>Size:</strong> ${data.sz || ''}</p>
//         <p><strong>Committed Finish Date:</strong> ${data.v?.c || ''}</p>
//         <p><strong>Project Manager:</strong> ${data.pm || ''}</p>
//         <p><strong>Designer:</strong> ${data.des || ''}</p>
//         <p><strong>Quantity:</strong> ${data.q || ''}</p>
//         <p><strong>Client Remarks:</strong> ${data.v?.cr || ''}</p>
//         <p><strong>Vendor Remarks:</strong> ${data.v?.rm || ''}</p>
//         <a href="${data.fld}" target="_blank">Product Folder</a><br>
//         <a href="${data.dl}" target="_blank">Drawing Files</a>
//       `;
//       document.getElementById("product-modal").classList.remove("hidden");
//     });
// }

// document.addEventListener('click', function (e) {
//   if (e.target.matches('.close-button') || e.target.matches('#product-modal')) {
//     document.getElementById("product-modal").classList.add("hidden");
//   }
// });


// document.addEventListener('DOMContentLoaded', function () {
//   const params = new URLSearchParams(window.location.search);
//   const vendorName = params.get("vendor") || "";
//   const vendorKey = cleanKey(vendorName);

//   function parseDate(dateStr) {
//     if (!dateStr) return new Date(9999, 11, 31);
//     const [day, monthStr, year] = String(dateStr).split('-');
//     const months = {
//       Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
//       Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
//     };
//     const parsedDay = parseInt(day);
//     const parsedYear = parseInt(year);
//     const parsedMonth = months[monthStr];
//     return (isNaN(parsedDay) || isNaN(parsedYear) || parsedMonth === undefined)
//       ? new Date(9999, 11, 31)
//       : new Date(parsedYear, parsedMonth, parsedDay);
//   }

//   function fetchVendorData() {
//     fetch(`https://raw.githubusercontent.com/ub1qu1tous/vendor-dashboard/main/data/latest.json`)
//       .then(res => res.json())
//       .then(data => {
//         const vendorData = data.vendors?.[vendorKey];
//         if (!vendorData || vendorData.length === 0) {
//           document.getElementById("vendor-name").textContent = "Vendor Not Found";
//           return;
//         }

//         const vendorDisplayName = vendorData[0]?.vendorDisplayName || vendorKey;
//         document.title = vendorDisplayName + " - Vendor Order List";
//         document.getElementById("vendor-name").textContent = vendorDisplayName;

//         const tbody = document.getElementById("product-rows");
//         tbody.innerHTML = "";

//         const mobileList = document.getElementById("product-list");
//         if (mobileList) mobileList.innerHTML = "";

//         vendorData
//           .sort((a, b) => parseDate(a.v?.c) - parseDate(b.v?.c))
//           .forEach((d, index) => {
//             const today = new Date();
//             const committedDate = parseDate(d.v?.c);
//             let dateCellStyle = '';
//             let dateTextStyle = '';

//             if (d.v?.c) {
//               const diffInDays = Math.ceil((committedDate - today) / (1000 * 60 * 60 * 24));
//               if (diffInDays <= 0) {
//                 dateCellStyle = 'style="background: #E06666; color: white;"';
//                 dateTextStyle = 'style="background: #E06666; color: black; padding: 0 5px; border-radius: 5px;"';
//               } else if (diffInDays < 3) {
//                 dateCellStyle = 'style="background: #FFD966; color: #333;"';
//                 dateTextStyle = 'style="background: #FFD966; color: black; padding: 0 5px; border-radius: 5px;"';
//               }
//             }

//             const tr = document.createElement("tr");
//             tr.innerHTML = `
//               <td>${index + 1}</td>
//               <td ${dateCellStyle}>${d.v?.c || ''}</td>
//               <td>${d.op || ''}</td>
//               <td>
//                 <div class="image-wrapper">
//                   ${d.url ? `<a href="${d.url}" target="_blank"><img src="${d.url}" class="thumbnail" loading="lazy" referrerpolicy="no-referrer" alt="product image"></a>` : `<span>No image</span>`}
//                 </div>
//               </td>
//               <td>${d.prod || ''}</td>
//               <td>${d.var || ''}</td>
//               <td>${d.cat || ''}</td>
//               <td>${d.mat || ''}</td>
//               <td>${d.sz || ''}</td>
//               <td>${d.cr || ''}</td>
//               <td>${d.v?.rm || ''}</td>
//               <td>${d.pm || ''}</td>
//               <td><a href="${d.fld}" target="_blank">Folder</a></td>
//               <td>${d.dl && d.dl.startsWith('http') ? `<a href="${d.dl}" target="_blank">${d.des || ''}</a>` : `${d.des || ''}`}</td>
//               <td>${d.q || ''}</td>
//               <td>${d.v?.t || ''}</td>
//             `;
//             tbody.appendChild(tr);

//             if (mobileList) {
//               const card = document.createElement("div");
//               card.className = "product-card";
//               card.innerHTML = `
//                 ${d.url ? `<img src="${d.url}" alt="Product Image" class="thumbnail">` : `<div>No Image</div>`}
//                 <h3>${d.prod || ''} ${d.var || ''}</h3>
//                 <p>Committed Finish Date: <span ${dateTextStyle}>${d.v?.c || 'N/A'}</span></p>
//               `;
//               // Card click opens modal
//               card.addEventListener('click', () => showProductDetail(vendorKey, index));
//               mobileList.appendChild(card);
//             }
//           });
//       })
//       .catch(error => {
//         console.error("Error fetching vendor data:", error);
//         document.getElementById("product-rows").innerHTML = `
//           <tr><td colspan="16">Error loading vendor data. Please try again later.</td></tr>`;
//       });
//   }

//   fetchVendorData();
// });

// function cleanKey(input) {
//   return (input || "").toString().trim().toLowerCase();
// }

// function showProductDetail(vendorKey, recordIndex) {
//   fetch(`https://raw.githubusercontent.com/ub1qu1tous/vendor-dashboard/main/data/latest.json`)
//     .then(res => res.json())
//     .then(data => {
//       const record = data.vendors?.[vendorKey]?.[recordIndex];
//       if (!record) return;

//       const container = document.getElementById("product-detail");
//       container.innerHTML = `
//         <h2>${record.prod || ''} ${record.var || ''}</h2>
//         ${record.url ? `<img src="${record.url}" class="thumbnail" alt="Product Image">` : ''}
//         <p><strong>Category:</strong> ${record.cat || ''}</p>
//         <p><strong>Material:</strong> ${record.mat || ''}</p>
//         <p><strong>Size:</strong> ${record.sz || ''}</p>
//         <p><strong>Committed Finish Date:</strong> ${record.v?.c || ''}</p>
//         <p><strong>Project Manager:</strong> ${record.pm || ''}</p>
//         <p><strong>Designer:</strong> ${record.des || ''}</p>
//         <p><strong>Quantity:</strong> ${record.q || ''}</p>
//         <p><strong>Client Remarks:</strong> ${record.cr || ''}</p>
//         <p><strong>Vendor Remarks:</strong> ${record.v?.rm || ''}</p>
//         ${record.fld ? `<a href="${record.fld}" target="_blank">Product Folder</a><br>` : ''}
//         ${record.dl ? `<a href="${record.dl}" target="_blank">Drawing Files</a>` : ''}
//       `;
//       document.getElementById("product-modal").classList.remove("hidden");
//     });
// }

// document.addEventListener('click', function (e) {
//   if (e.target.matches('.close-button') || e.target.matches('#product-modal')) {
//     document.getElementById("product-modal").classList.add("hidden");
//   }
// });

let sortedRecords = [];

document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const vendorName = params.get("vendor") || "";
  const vendorKey = cleanKey(vendorName);

  // let sortedRecords = []; // Save sorted records in memory

  function parseDate(dateStr) {
    if (!dateStr) return new Date(9999, 11, 31);
    const [day, monthStr, year] = String(dateStr).split('-');
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sept: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const parsedDay = parseInt(day);
    const parsedYear = parseInt(year);
    const parsedMonth = months[monthStr];
    return (isNaN(parsedDay) || isNaN(parsedYear) || parsedMonth === undefined)
      ? new Date(9999, 11, 31)
      : new Date(parsedYear, parsedMonth, parsedDay);
  }

  function fetchVendorData() {
    fetch(`https://raw.githubusercontent.com/ub1qu1tous/vendor-dashboard/main/data/latest.json`)
      .then(res => res.json())
      .then(data => {
        const vendorData = data.vendors?.[vendorKey];
        if (!vendorData || vendorData.length === 0) {
          document.getElementById("vendor-name").textContent = "Vendor Not Found";
          return;
        }

        const vendorDisplayName = vendorData[0]?.vendorDisplayName || vendorKey;
        document.title = vendorDisplayName + " - Vendor Order List";
        document.getElementById("vendor-name").textContent = vendorDisplayName;

        // Sort once and save
        sortedRecords = vendorData.slice().sort((a, b) => parseDate(a.v?.c) - parseDate(b.v?.c));

        const tbody = document.getElementById("product-rows");
        tbody.innerHTML = "";

        const mobileList = document.getElementById("product-list");
        if (mobileList) mobileList.innerHTML = "";

        sortedRecords.forEach((d, index) => {
          const today = new Date();
          const committedDate = parseDate(d.v?.c);
          let dateCellStyle = '';
          let dateTextStyle = '';

          if (d.v?.c) {
            const diffInDays = Math.ceil((committedDate - today) / (1000 * 60 * 60 * 24));
            if (diffInDays <= 0) {
              dateCellStyle = 'style="background: #E06666; color: white;"';
              dateTextStyle = 'style="background: #E06666; color: black; padding: 0 5px; border-radius: 5px;"';
            } else if (diffInDays < 3) {
              dateCellStyle = 'style="background: #FFD966; color: #333;"';
              dateTextStyle = 'style="background: #FFD966; color: black; padding: 0 5px; border-radius: 5px;"';
            }
          }

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td ${dateCellStyle}>${d.v?.c || ''}</td>
            <td>${d.op || ''}</td>
            <td>
              <div class="image-wrapper">
                ${d.url ? `<a href="${d.url}" target="_blank"><img src="${d.url}" class="thumbnail"></a>` : `<span>No image</span>`}
              </div>
            </td>
            <td>${d.prod || ''}</td>
            <td>${d.var || ''}</td>
            <td>${d.cat || ''}</td>
            <td>${d.mat || ''}</td>
            <td>${d.sz || ''}</td>
            <td>${d.cr || ''}</td>
            <td>${d.v?.rm || ''}</td>
            <td>${d.pm || ''}</td>
            <td><a href="${d.fld}" target="_blank">Folder</a></td>
            <td>${d.des || ''}</td>
            <td>${d.dl || ''}</td>
            <td>${d.q || ''}</td>
            <td>${d.v?.t || ''}</td>
          `;
          tbody.appendChild(tr);

          if (mobileList) {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
              ${d.url ? `<img src="${d.url}" alt="Product Image" class="thumbnail">` : `<div>No Image</div>`}
              <h3>${d.prod || ''} ${d.var || ''}</h3>
              <p>Committed Finish Date: <span ${dateTextStyle}>${d.v?.c || 'N/A'}</span></p>
            `;
            // Clicking the card shows the modal
            card.addEventListener('click', () => showProductDetail(index));
            mobileList.appendChild(card);
          }
        });
        // Fetch and display last updated timestamp
        const lastUpdatedContainer = document.querySelector("#last-updated span");
        if (lastUpdatedContainer) {
          const dateStr = data.lastUpdated?.timestamp;
          if (dateStr) {
            const date = new Date(dateStr);
            const formatted = date.toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            });
            lastUpdatedContainer.textContent = `Last updated: ${formatted}`;
          } else {
            lastUpdatedContainer.textContent = "Timestamp unavailable";
          }
        }

      })
      .catch(error => {
        console.error("Error fetching vendor data:", error);
        document.getElementById("product-rows").innerHTML = `
          <tr><td colspan="16">Error loading vendor data. Please try again later.</td></tr>`;
      });
  }

  fetchVendorData();
});

function cleanKey(input) {
  return (input || "").toString().trim().toLowerCase();
}

function showProductDetail(recordIndex) {
  const record = sortedRecords?.[recordIndex];
  if (!record) return;

  const container = document.getElementById("product-detail");
  container.innerHTML = `
    <h2>${record.prod || ''} ${record.var || ''}</h2>
    ${record.url ? `<img src="${record.url}" class="thumbnail" alt="Product Image">` : ''}
    <p><strong>Category:</strong> ${record.cat || ''}</p>
    <p><strong>Material:</strong> ${record.mat || ''}</p>
    <p><strong>Size:</strong> ${record.sz || ''}</p>
    <p><strong>Committed Finish Date:</strong> ${record.v?.c || ''}</p>
    <p><strong>Project Manager:</strong> ${record.pm || ''}</p>
    <p><strong>Designer:</strong> ${record.des || ''}</p>
    <p><strong>Quantity:</strong> ${record.q || ''}</p>
    <p><strong>Client Remarks:</strong> ${record.cr || ''}</p>
    <p><strong>Vendor Remarks:</strong> ${record.v?.rm || ''}</p>
    <p><strong>Model Approved On:</strong> ${record.dl || ''}</p>
    ${record.fld ? `<a href="${record.fld}" target="_blank">Product Folder</a><br>` : ''}
  `;
  document.getElementById("product-modal").classList.remove("hidden");
}

document.addEventListener('click', function (e) {
  if (e.target.matches('.close-button') || e.target.matches('#product-modal')) {
    document.getElementById("product-modal").classList.add("hidden");
  }
});
