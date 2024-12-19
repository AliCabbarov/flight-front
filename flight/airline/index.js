document.addEventListener("DOMContentLoaded", () => {
  const airlineTable = document.getElementById("airlineTable").querySelector("tbody");
  const createAirlineBtn = document.getElementById("createAirlineBtn");
  const createAirlineModal = document.getElementById("createAirlineModal");
  const createAirlineForm = document.getElementById("createAirlineForm");
  const closeModalBtn = document.getElementById("closeModalBtn");

  // Fetch and populate airlines
  const fetchAirlines = async () => {
    try {
      const response = await apiFetch(FLIGHT_MS_API_BASE_URL,"/airlines", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const airlines = await response.json();

      airlineTable.innerHTML = ""; // Clear previous rows
      airlines.forEach(airline => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${airline.id}</td>
          <td>${airline.name}</td>
          <td>
            <button class="delete-btn" data-id="${airline.id}">Delete</button>
          </td>
        `;

        airlineTable.appendChild(row);
      });

      // Add delete functionality
      document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async (event) => {
          const airlineId = event.target.getAttribute("data-id");
          await deleteAirline(airlineId);
          await fetchAirlines();
        });
      });
    } catch (error) {
      console.error("Error fetching airlines:", error);
    }
  };

  // Create airline
  createAirlineForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const airlineName = document.getElementById("airlineName").value;

    try {
      await apiFetch(FLIGHT_MS_API_BASE_URL,"/airlines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: airlineName }),
      });

      createAirlineModal.style.display = "none";
      await fetchAirlines();
    } catch (error) {
      console.error("Error creating airline:", error);
    }
  });

  // Delete airline
  const deleteAirline = async (id) => {
    try {
      await apiFetch(FLIGHT_MS_API_BASE_URL,`/airlines/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting airline:", error);
    }
  };

  // Modal open/close
  createAirlineBtn.addEventListener("click", () => {
    createAirlineModal.style.display = "block";
  });

  closeModalBtn.addEventListener("click", () => {
    createAirlineModal.style.display = "none";
  });

  // Fetch airlines on page load
  fetchAirlines().then(r => console.log("Airlines fetched"));
});
