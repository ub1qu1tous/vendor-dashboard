// netlify/functions/vendor-data.js
const fetch = require("node-fetch");

let cache = null;
let lastFetch = 0;
const TTL = 10 * 60 * 1000; // Cache for 10 minutes

exports.handler = async function () {
  const now = Date.now();
  if (cache && now - lastFetch < TTL) {
    return {
      statusCode: 200,
      body: JSON.stringify(cache),
      headers: { "Cache-Control": "max-age=0" }
    };
  }

  const res = await fetch("https://script.google.com/macros/s/AKfycbx0IVl18EoVAeW0GYHtnHuNHRlJYjhXPkVij59-RbW7EI2MjcW1HHKYEApyj96_5-Bu/exec");
  const data = await res.json();

  cache = data;
  lastFetch = now;

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: { "Cache-Control": "max-age=0" }
  };
};
