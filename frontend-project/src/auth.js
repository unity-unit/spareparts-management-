export function getToken() {
  return localStorage.getItem('pssms_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('pssms_token', token);
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem('pssms_token');
}
