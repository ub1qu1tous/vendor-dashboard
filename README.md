# Vendor Order List Dashboard

A live dashboard to view and track work orders per vendor, powered by Firebase Realtime Database and hosted via Firebase Hosting.

**Live Dashboard**: [https://ub1qu1tous.github.io/vendor-dashboard/](https://ub1qu1tous.github.io/vendor-dashboard/) 

or 

[https://vendor-dashboard-b63fb.web.app/](https://vendor-dashboard-b63fb.web.app/)
---

## Features

- Vendor overview with active order counts.
- Individual vendor pages with detailed product information.
- Conditional formatting for overdue tasks.
- Thumbnail previews and links to folders/files.
- Auto-updating timestamp for data freshness.
- Responsive design and print-friendly layout.
- Firebase-hosted with clean URLs and custom 404 page.

---

## Project Structure

vendor-dashboard/
- `index.html` — Vendor list landing page
- `vendor.html` — Individual vendor detail view
- `404.html` — Custom 404 error page
- `style.css` — Styling and responsive layout
- `vendors.js` — Loads and displays the vendor index
- `vendor.js` — Renders data for an individual vendor based on URL params
- `vendor-header.js` — Fetches and shows last updated timestamp
- `firebase.json` — Firebase Hosting configuration file
- `README.md` — Project documentation


---

## How It Works

- **Data Source**: Firebase Realtime Database at:

https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/


- **index.html** + `vendors.js`:
- Fetches all vendor data.
- Filters vendors with active (`rts: false`) entries.
- Displays links like: `vendor.html?vendor=vendor_key`.

- **vendor.html** + `vendor.js`:
- Parses `vendor` from URL parameters.
- Fetches and displays vendor-specific records.
- Sorts by `Expected Finish Date`.
- Highlights overdue dates in red.
- Provides links for image previews, folders, and downloadable files.

- **vendor-header.js**:
- Loads and formats a last updated timestamp from `/lastUpdated.json`.

---

## Auto Updates

- Vendor data loads dynamically.
- Timestamp updates on each page load.
- (Optional) Uncomment `setInterval()` in `vendor.js` to enable auto-refresh every 10 seconds.

---

## Print-Optimized

- Landscape A3 format for printing.
- Print styles and overflow handling included in CSS.

---

## Hosting

- Hosted via Firebase.
- Routing fallback handled by `404.html`.

