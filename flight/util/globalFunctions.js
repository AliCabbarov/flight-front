function getToken() {
  return localStorage.getItem('token');
}

async function apiFetch(baseUrl, endpoint, options = {}) {
  let token = getToken();
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  let response = await fetch(`${baseUrl}${endpoint}`, options);
  if (response.status === 401) {
    try {
      token = await refreshAuthToken();
      options.headers['Authorization'] = `Bearer ${token}`;
      response = await fetch(`${baseUrl}${endpoint}`, options);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }

  return response;
}


async function refreshAuthToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(USER_MS_API_BASE_URL + '/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({refreshToken})
  });

  if (response.status === 200) {
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.token;
  } else {
    throw new Error('Failed to refresh token');
  }
}


async function fetchUserData() {
  try {
    const userData = await apiFetch('/users', {method: 'GET'});
    console.log('User Data:', userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}
