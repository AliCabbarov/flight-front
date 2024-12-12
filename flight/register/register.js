document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent form submission

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const firstName = document.getElementById('firstName').value;
  const lastname = document.getElementById('lastName').value;

  const responseMessage = document.getElementById('responseMessage');

  try {
    const response = await apiFetch(USER_MS_API_BASE_URL, '/auth/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email, password: password, firstName: firstName, lastName: lastname})
    });
    if (response.status === 200) {
      responseMessage.style.color = 'green';
      responseMessage.textContent = 'Register successful!';
      alert("Registration successful! Please verify your email to login.");
    } else {
      const data = await response.json();
      responseMessage.style.color = 'red';
      responseMessage.textContent = data.details;
    }
  } catch (error) {
    responseMessage.style.color = 'red';
    responseMessage.textContent = 'An error occurred. Please try again later.';
    console.error(error);
  }
});
