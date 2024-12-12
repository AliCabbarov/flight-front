const params = new URLSearchParams(window.location.search);
const token = params.get('token');
const verifyText = document.getElementById('verify-text');

const verifyToken = async () => {
  const response =  await apiFetch(USER_MS_API_BASE_URL, `/auth/verify?token=${token}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  })
  if(response.status===200){
    setTimeout(()=>{
      verifyText.textContent = 'Verification successful! Please login to continue.'
      verifyText.style.color = 'green';
    },1000)
    setTimeout(()=>{
      window.location.href = '../login/login.html'
    },2000)
  }
}
verifyToken();
