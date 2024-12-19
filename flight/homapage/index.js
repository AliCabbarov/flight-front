// Function to fetch flight data from the API
const fetchFlightData = async () => {
  try {
    const response = await apiFetch(FLIGHT_MS_API_BASE_URL, '/booking/search', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    return await response.json(); // API response data
  } catch (error) {
    console.error("Error fetching flight data:", error);
    return null;
  }
};

// Function to populate the table with flight data
const populateFlightTable = async () => {
  const tableBody = document.querySelector("#flightTable tbody");

  try {
    // Fetch the flight data from the API
    const flights = await fetchFlightData();

    if (!flights) {
      tableBody.innerHTML = `<tr><td colspan="6" class="error-message">Failed to load flight data.</td></tr>`;
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
        <td>${flight.to}</td>
        <td>${flight.from}</td>
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

  try {
    const response = await apiFetch(FLIGHT_MS_API_BASE_URL, '/flights/search', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, departureDate }),
    });

    if (!response.ok) {
      new Error(`HTTP error! status: ${response.status}`);
    }

    const searchResults = await response.json();
    displaySearchResults(searchResults);
  } catch (error) {
    console.error("Error searching flights:", error);
    alert("An error occurred while searching for flights. Please try again.");
  }
};

// Function to display search results
const displaySearchResults = (flights) => {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';

  if (flights.length === 0) {
    resultsContainer.innerHTML = '<p>No flights found matching your criteria.</p>';
    return;
  }

  const resultsTable = document.createElement('table');
  resultsTable.innerHTML = `
    <thead>
      <tr>
        <th>Price</th>
        <th>Departure</th>
        <th>Arrival</th>
        <th>Departure Time</th>
        <th>Arrival Time</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;

  const tableBody = resultsTable.querySelector('tbody');

  flights.forEach((flight) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${flight.flightNumber}</td>
      <td>${flight.departureAirport}</td>
      <td>${flight.arrivalAirport}</td>
      <td>${new Date(flight.departureTime).toLocaleString()}</td>
      <td>${new Date(flight.arrivalTime).toLocaleString()}</td>
      <td><button class="book-btn" data-flight-id="${flight.id}">Book</button></td>
    `;
    tableBody.appendChild(row);
  });

  resultsContainer.appendChild(resultsTable);
};

// Function to handle flight booking
const handleFlightBooking = async (flightId) => {
  try {
    const response = await apiFetch(FLIGHT_MS_API_BASE_URL, '/bookings', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flightId }),
    });

    if (!response.ok) {
      new Error(`HTTP error! status: ${response.status}`);
    }

    const booking = await response.json();
    alert(`Flight booked successfully! Booking ID: ${booking.id}`);
  } catch (error) {
    console.error("Error booking flight:", error);
    alert("An error occurred while booking the flight. Please try again.");
  }
};

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Load flights when the page loads
  populateFlightTable().then(r => console.log('Flight data loaded.'));

  // Add event listener for flight search form
  const searchForm = document.getElementById('flightSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', handleFlightSearch);
  }

  // Add event listener for flight booking buttons
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('book-btn')) {
      const flightId = event.target.getAttribute('data-flight-id');
      handleFlightBooking(flightId).then(r => populateFlightTable());
    }
  });
});
