fetch("https://vendor-dashboard-b63fb-default-rtdb.asia-southeast1.firebasedatabase.app/lastUpdated.json")
  .then(res => res.json())
  .then(data => {
    const date = new Date(data.timestamp);
    const formatted = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    document.querySelector("#last-updated span").textContent = formatted + " - Updated automatically every 15 minutes ";
  })
  .catch(() => {
    document.querySelector("#last-updated span").textContent = "Unavailable";
  });
