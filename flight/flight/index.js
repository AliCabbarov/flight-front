document.addEventListener('DOMContentLoaded', () => {
  const createFlightForm = document.getElementById('createFlightForm');
  const fromSelect = document.getElementById('from');
  const toSelect = document.getElementById('to');
  const planeIdSelect = document.getElementById('planeId');

  // Fetch available destinations and populate the "from" and "to" selects
  const fetchDestinations = async () => {
    try {
      const response = await apiFetch(FLIGHT_MS_API_BASE_URL, '/flights/destination', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const destinations = await response.json();
      // Clear previous options
      fromSelect.innerHTML = '';
      toSelect.innerHTML = '';

      // Populate "From" and "To" selects
      destinations.forEach(destination => {
        const option = document.createElement('option');
        option.value = destination;
        option.textContent = destination;
        fromSelect.appendChild(option);

        // To select, add destination options as well
        const optionTo = document.createElement('option');
        optionTo.value = destination;
        optionTo.textContent = destination;
        toSelect.appendChild(optionTo);
      });
    } catch (error) {
      console.error('Error fetching destinations:', error);
      alert('Failed to load destinations. Please try again later.');
    }
  };

  // Fetch planes and populate the select list
  const fetchPlanes = async () => {
    try {
      const response = await apiFetch(FLIGHT_MS_API_BASE_URL, '/planes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const planes = await response.json();
      planes.forEach(plane => {
        const option = document.createElement('option');
        option.value = plane.id;
        option.textContent = `${plane.name} (ID: ${plane.id})`;
        planeIdSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching planes:', error);
      alert('Failed to load planes. Please try again later.');
    }
  };

  // Handle form submission
  createFlightForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(createFlightForm);
    const flightData = {
      from: formData.get('from'),
      to: formData.get('to'),
      price: parseFloat(formData.get('price')),
      departureTime: new Date(formData.get('departureTime')).toISOString(),
      arrivalTime: new Date(formData.get('arrivalTime')).toISOString(),
      planeId: parseInt(formData.get('planeId'), 10)
    };

    try {
      if (flightData.departureTime >= flightData.arrivalTime) {
        alert('Departure time must be before arrival time.');
        return;
      }
      if (flightData.from === flightData.to) {
        alert('From and To destinations must be different.');
        return;
      }
      if (flightData.departureTime < new Date().toISOString()) {
        alert('Departure time must be in the future.');
        return;
      }
      const response = await apiFetch(FLIGHT_MS_API_BASE_URL, '/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdFlight = await response.json();
      alert('Flight created successfully!');
      createFlightForm.reset();
    } catch (error) {
      console.error('Error creating flight:', error);
      alert('Failed to create flight. Please try again.');
    }
  });

  // Fetch destinations and planes when the page loads
  fetchDestinations().then(r => fetchPlanes());
  fetchPlanes().then(r => fetchDestinations());
});
