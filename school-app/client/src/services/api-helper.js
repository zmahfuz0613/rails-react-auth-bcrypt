const baseUrl = 'http://localhost:3000'

export const loginUser = (loginData) => {
  const opts = {
    method: 'POST',
    body: JSON.stringify(loginData),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return fetch(`${baseUrl}/auth/login`, opts)
    .then(resp => resp.json())
}

export const registerUser = (registerData) => {
  const opts = {
    method: 'POST',
    body: JSON.stringify(registerData),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return fetch(`${baseUrl}/users/`, opts)
    .then(resp => resp.json())
}

const createTeacher = (data) => {
  const opts = {
    method: 'POST',
    body: JSON.stringify({ teacher: data }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch(`${baseUrl}/teachers`, opts)
    .then(resp => resp.json())
}

const readAllTeachers = () => {
  return fetch(`${baseUrl}/teachers`)
    .then(resp => resp.json())
}

const updateTeacher = (id, data) => {
  const opts = {
    method: 'PUT',
    body: JSON.stringify({ teacher: data }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return fetch(`${baseUrl}/teachers/${id}`, opts)
    .then(resp => resp.json())
}

const destroyTeacher = (id) => {
  const opts = {
    method: 'DELETE'
  }
  return fetch(`${baseUrl}/teachers/${id}`, opts)
}

export {
  createTeacher,
  readAllTeachers,
  updateTeacher,
  destroyTeacher
}