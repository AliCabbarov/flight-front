// Function to fetch plane data from the API
const fetchPlaneData = async () => {
  try {
    const response = await apiFetch(FLIGHT_MS_API_BASE_URL, '/planes', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const planeData = await response.json();
    return planeData; // API response data
  } catch (error) {
    console.error("Error fetching plane data:", error);
    return null;
  }
};

// Function to populate the table with plane data
const populateTable = async () => {
  const tableBody = document.querySelector("#planeTable tbody");

  try {
    // Fetch the plane data from the API
    const planes = await fetchPlaneData();

    if (!planes) {
      tableBody.innerHTML = `<tr><td colspan="4" style="color:red;">Failed to load data.</td></tr>`;
      return;
    }

    // Clear existing rows before populating new data
    tableBody.innerHTML = '';

    // Iterate over the data and populate the table
    planes.forEach((plane) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${plane.id}</td>
        <td>${plane.name}</td>
        <td>${plane.capacity}</td>
        <td>${plane.airlineName}</td>
        <td><button class="delete-btn">delete</button></td>
      `;
      tableBody.appendChild(newRow);
    });
  } catch (error) {
    console.error("Error populating table:", error);
    tableBody.innerHTML = `<tr><td colspan="4" style="color:red;">An error occurred while loading data.</td></tr>`;
  }
};

// Execute the function when the page loads
window.onload = populateTable;

document.addEventListener("DOMContentLoaded", async () => {
  const createPlaneBtn = document.getElementById("createPlaneBtn");
  const createPlaneModal = document.getElementById("createPlaneModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const createPlaneForm = document.getElementById("createPlaneForm");
  const airlineSelect = document.getElementById("airlineSelect");
  const planePlacesSelect = document.getElementById("planePlacesSelect");

  // Open Modal
  createPlaneBtn.addEventListener("click", () => {
    createPlaneModal.style.display = "block";
    populateSelectBoxes(); // Populate dropdowns when opening modal
  });

  // Close Modal
  closeModalBtn.addEventListener("click", () => {
    createPlaneModal.style.display = "none";
  });

  // Fetch and Populate Dropdown Options
  const populateSelectBoxes = async () => {
    try {
      // Fetch Airlines
      const airlineResponse = await apiFetch(FLIGHT_MS_API_BASE_URL, '/airlines', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const airlines = await airlineResponse.json();
      airlineSelect.innerHTML = airlines
        .map((airline) => `<option value="${airline.id}">${airline.name}</option>`)
        .join("");

      // Fetch Plane Places
      const planePlacesResponse = await apiFetch(FLIGHT_MS_API_BASE_URL, '/plane-places', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const planePlaces = await planePlacesResponse.json();
      planePlacesSelect.innerHTML = planePlaces
        .map((place) => `<option value="${place.id}">${place.placeNumber}</option>`)
        .join("");
    } catch (error) {
      console.error("Error populating dropdowns:", error);
    }
  };

  // Handle Form Submission
  createPlaneForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const planeName = document.getElementById("planeName").value;
    const airlineId = airlineSelect.value;
    const planePlacesIds = Array.from(planePlacesSelect.selectedOptions).map(
      (option) => parseInt(option.value, 10)
    );

    const payload = {
      name: planeName,
      airlineId: parseInt(airlineId, 10),
      planePlacesIds: planePlacesIds,
    };

    try {
      const response = await apiFetch(FLIGHT_MS_API_BASE_URL, '/planes', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Plane created successfully!");
        createPlaneModal.style.display = "none"; // Close modal
        populateTable(); // Refresh table data after creation
      } else {
        const errorData = await response.json();
        alert(`Error creating plane: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating plane:", error);
      alert("An error occurred while creating the plane.");
    }
  });
});

// Delete plane button click event

document.querySelector("#planeTable tbody").addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const row = e.target.closest("tr");
    const planeId = row.children[0].textContent;

    if (confirm("Are you sure you want to delete this plane?")) {
      try {
        const response = await apiFetch(FLIGHT_MS_API_BASE_URL, `/planes/${planeId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          alert("Plane deleted successfully!");
          populateTable(); // Refresh table data after deletion
        } else {
          const errorData = await response.json();
          alert(`Error deleting plane: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error deleting plane:", error);
        alert("An error occurred while deleting the plane.");
      }
    }
  }
});
