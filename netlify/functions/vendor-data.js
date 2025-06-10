// netlify/functions/vendor-data.js

// Change 'require' to dynamic 'import' for node-fetch
// You can destructure fetch from the imported module
let fetch;
import('node-fetch').then(module => {
  fetch = module.default; // node-fetch exports a default
}).catch(error => {
  console.error("Failed to load node-fetch:", error);
  // Handle error, maybe rethrow or set fetch to a dummy function
});

let cache = null;
let lastFetch = 0;
const TTL = 10 * 60 * 1000; // Cache for 10 minutes

exports.handler = async function () {
  // Ensure fetch is loaded before proceeding
  if (!fetch) {
    // Add a small delay and re-check to allow the dynamic import to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!fetch) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "node-fetch not loaded. Dynamic import might have failed." }),
      };
    }
  }

  const now = Date.now();
  if (cache && now - lastFetch < TTL) {
    return {
      statusCode: 200,
      body: JSON.stringify(cache),
      headers: { "Cache-Control": "max-age=0" }
    };
  }

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbx3xTvOX8viwPOdGcKE-eYwgDUN-y5ImLwXeMYW3xDlnftU3u7763KsgLj7FzbUctWT/exec");
    const data = await res.json();

    cache = data;
    lastFetch = now;

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { "Cache-Control": "max-age=0" }
    };
  } catch (error) {
    console.error("Error fetching data from Google Apps Script:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch vendor data from Google Apps Script", details: error.message }),
    };
  }
};