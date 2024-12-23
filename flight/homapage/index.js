// Function to fetch flight data from the API
const fetchFlightData = async (filters = {}) => {
  try {
    // Construct query parameters for GET request
    const queryParams = new URLSearchParams(filters).toString();
    const url = `/booking/search${queryParams ? `?${queryParams}` : ''}`;

    const response = await apiFetch(FLIGHT_MS_API_BASE_URL,url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    return await response.json();
  } catch (error) {
    console.error("Error fetching flight data:", error);
    return null;
  }
};

// Function to populate the table with flight data
const populateFlightTable = async (filters = {}) => {
  const tableBody = document.querySelector("#flightTable tbody");

  try {
    // Fetch the flight data from the API
    const flights = await fetchFlightData(filters);

    if (!flights || flights.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="error-message">No flights found.</td></tr>`;
      return;
    }

    // Clear existing rows before populating new data
    tableBody.innerHTML = '';

    // Iterate over the data and populate the table
    flights.forEach((flight) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${flight.id}</td>
        <td>${flight.price}</td>
        <td>${flight.from}</td>
        <td>${flight.to}</td>
        <td>${new Date(flight.departureTime).toLocaleString()}</td>
        <td>${new Date(flight.arrivalTime).toLocaleString()}</td>
      `;
      tableBody.appendChild(newRow);
    });
  } catch (error) {
    console.error("Error populating flight table:", error);
    tableBody.innerHTML = `<tr><td colspan="6" class="error-message">An error occurred while loading flight data.</td></tr>`;
  }
};

// Function to handle flight search
const handleFlightSearch = async (event) => {
  event.preventDefault();
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const departureDate = document.getElementById('departureDate').value;

  // Create filters object
  const filters = {};
  if (from) filters.from = from;
  if (to) filters.to = to;
  if (departureDate) filters.departureDate = departureDate;

  // Populate table with filtered data
  await populateFlightTable(filters);
};

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Load all flights when the page loads
  populateFlightTable().then(() => console.log('All flight data loaded.'));

  // Add event listener for flight search form
  const searchForm = document.getElementById('flightSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', handleFlightSearch);
  }
});
