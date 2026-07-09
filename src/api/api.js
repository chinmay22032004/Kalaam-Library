// Frontend API client to communicate with the Node.js/Express server.
// It matches the exact interface of mockApi.js to ensure drop-in compatibility.

const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Server error occurred');
  }
  return data;
};

export const api = {
  getSettings: async () => {
    const res = await fetch('/api/settings');
    return handleResponse(res);
  },

  getBooks: async () => {
    const res = await fetch('/api/books');
    return handleResponse(res);
  },

  // User registration: { mobile, password, displayName, isAdmin }
  registerUser: async ({ mobile, password, displayName = "", isAdmin = false }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mobile, password, displayName, isAdmin })
    });
    return handleResponse(res);
  },

  // Login with mobile & password -> returns { token, user: { id, mobile, displayName, isAdmin } }
  loginUser: async ({ mobile, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mobile, password })
    });
    return handleResponse(res);
  },

  // Login with Google -> returns { token, user }
  loginWithGoogle: async (credential) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ credential })
    });
    return handleResponse(res);
  },

  logout: async (token) => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getHeaders(token)
      });
      return res.ok;
    } catch {
      return true; // Return true anyway as client will clear credentials
    }
  },

  getCurrentUser: async (token) => {
    if (!token) return null;
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: getHeaders(token)
    });
    return handleResponse(res);
  },

  updateProfile: async (data, token) => {
    const res = await fetch('/api/auth/me/profile', {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  isAdminRegistered: async () => {
    const res = await fetch('/api/auth/admin-registered');
    return handleResponse(res);
  },

  getUsers: async (token) => {
    const res = await fetch('/api/admin/users', {
      method: 'GET',
      headers: getHeaders(token)
    });
    return handleResponse(res);
  },

  transferAdmin: async (token, newAdminId) => {
    const res = await fetch(`/api/admin/users/${newAdminId}/transfer-admin`, {
      method: 'PUT',
      headers: getHeaders(token)
    });
    return handleResponse(res);
  },

  deleteUser: async (token, userId) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return handleResponse(res);
  },

  addBook: async (bookData, token) => {
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(bookData)
    });
    return handleResponse(res);
  },

  deleteBook: async (id, token) => {
    const res = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return handleResponse(res);
  },

  updateBook: async (id, data, token) => {
    const res = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  updateSettings: async (type, data, token) => {
    const res = await fetch(`/api/settings/${type}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  addFavorite: async (bookId, token) => {
    const res = await fetch('/api/auth/me/favorites', {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ bookId })
    });
    return handleResponse(res);
  },

  removeFavorite: async (bookId, token) => {
    const res = await fetch(`/api/auth/me/favorites/${bookId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return handleResponse(res);
  }
};
