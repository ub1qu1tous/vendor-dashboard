# Vendor Order List Dashboard

A live dashboard to view and track workorders per vendor, powered by Google Sheets + Google Apps Script + GitHub Pages.

**Live Demo**: [https://ub1qu1tous.github.io/vendor-dashboard/](https://ub1qu1tous.github.io/vendor-dashboard/)

---

## Project Structure

/vendor-dashboard
├── index.html # Vendor list landing page
├── vendor.html # Individual vendor view
├── style.css # Styling and layout
├── vendors.js # Loads vendor list dynamically
├── vendor.js # Renders product table per vendor
└── README.md

vendors.js loads and lists vendors.

vendor.js filters products by vendor from the query string.

Data auto-refreshes every 10 seconds without reloading the page.
