document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const responseMessage = document.getElementById('responseMessage');

    try {
      const response = await apiFetch(USER_MS_API_BASE_URL, '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      if (response.status === 200) {
        const data = await response.json();
        const token = data.token;
        const refreshToken = data.refreshToken;

        responseMessage.style.color = 'green';
        responseMessage.textContent = 'Login successful!';
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setTimeout(() => {
          window.location.href = '../homapage/index.html';
        });
      } else {
        const res = await response.json();
        responseMessage.style.color = 'red';
        responseMessage.textContent = res.message;
      }
    } catch
      (error) {
      responseMessage.style.color = 'red';
      responseMessage.textContent = response;
      console.error(error);
    }
    dispatchEvent(new Event('login'));
  }
)
;
