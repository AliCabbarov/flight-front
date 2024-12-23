const fetchPendingFlights = async () => {
  try {
    const response = await apiFetch(FLIGHT_MS_API_BASE_URL, `/flights/pending-approval`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) new Error("Failed to fetch pending flights");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Populate pending flights table
const populatePendingFlightTable = async () => {
  const tableBody = document.querySelector("#pendingFlightTable tbody");
  tableBody.innerHTML = "";
  const flights = await fetchPendingFlights();

  if (flights.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='10'>No flights pending approval</td></tr>";
    return;
  }

  flights.forEach((flight) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${flight.operatorName}</td>
      <td>${flight.operatorEmail}</td>
      <td>${flight.flightDto.from}</td>
      <td>${flight.flightDto.to}</td>
      <td>${flight.flightDto.price}</td>
      <td>${flight.flightDto.ticketCount}</td>
      <td>${new Date(flight.flightDto.departureTime).toLocaleString()}</td>
      <td>${new Date(flight.flightDto.arrivalTime).toLocaleString()}</td>
      <td>
        <button onclick="approveFlight('${flight.flightDto.id}')">Approve</button>
        <button onclick="rejectFlight('${flight.flightDto.id}')">Reject</button>
      </td>
      <td>
        <textarea id="feedback-${flight.flightDto.id}" placeholder="Optional feedback"></textarea>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

// Approve flight with optional feedback
const approveFlight = async (flightId) => {
  const feedbackElement = document.querySelector(`#feedback-${flightId}`);
  const feedback = feedbackElement ? feedbackElement.value : null;

  let url = `/flights/approve/${flightId}`;

  if (feedback) {
    url += `?feedback=${encodeURIComponent(feedback)}`;
  }
  try {
    const response = await apiFetch(FLIGHT_MS_API_BASE_URL, url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({feedback})
    });
    if (!response.ok) new Error("Error approving flight");
    alert("Flight approved");
    await populatePendingFlightTable();
  } catch (error) {
    console.error("Error approving flight", error);
  }
};

// Reject flight with optional feedback
const rejectFlight = async (flightId) => {
  const feedbackElement = document.querySelector(`#feedback-${flightId}`);
  const feedback = feedbackElement ? feedbackElement.value : null;

  let url = `/flights/reject/${flightId}`;

  if (feedback) {
    url += `?feedback=${encodeURIComponent(feedback)}`;
  }
  try {
    const response = await apiFetch(FLIGHT_MS_API_BASE_URL, url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
    });
    if (!response.ok) new Error("Error rejecting flight");
    alert("Flight rejected");
    await populatePendingFlightTable();
  } catch (error) {
    console.error("Error rejecting flight", error);
  }
};

// Initialize
document.addEventListener("DOMContentLoaded", populatePendingFlightTable);
