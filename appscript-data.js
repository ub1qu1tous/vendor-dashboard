// appscript-data.js
// This file centralizes the logic for fetching data from your Google Apps Script Web App.

// Your Google Apps Script Web App URL (from the previous vendor-data.js)
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx3xTvOX8viwPOdGcKE-eYwgDUN-y5ImLwXeMYW3xDlnftU3u7763KsgLj7FzbUctWT/exec";

/**
 * Fetches data from the deployed Google Apps Script Web App.
 * Assumes the Apps Script doGet function returns a JSON array of objects.
 * @returns {Promise<Array<Object>>} A promise that resolves with the JSON data from the Apps Script.
 * @throws {Error} If the network response is not ok or if there's a problem parsing the JSON.
 */
export async function fetchGoogleAppsScriptData() {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL);

    if (!response.ok) {
      // If the HTTP status is not 2xx, throw an error
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from Google Apps Script:", error);
    // Re-throw the error so calling functions (like those in vendors.js/vendor.js) can handle it.
    throw error;
  }
}