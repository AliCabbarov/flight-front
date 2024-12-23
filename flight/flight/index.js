document.addEventListener('DOMContentLoaded', () => {
  const createFlightForm = document.getElementById('createFlightForm');
  const planeIdSelect = document.getElementById('planeId');

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

  // Fetch planes when the page loads
  fetchPlanes();
});

