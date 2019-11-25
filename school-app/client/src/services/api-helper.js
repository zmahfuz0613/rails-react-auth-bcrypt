import axios from 'axios';

const baseUrl = 'http://localhost:3000'

const api = axios.create({
  baseURL: baseUrl
})

export const loginUser = async (loginData) => {
  const resp = await api.post('/auth/login', loginData)
  localStorage.setItem('authToken', resp.data.token);
  api.defaults.headers.common.authorization = `Bearer ${resp.data.token}`
  return resp.data.user
}

export const registerUser = async (registerData) => {
  const resp = await api.post('/users/', { user: registerData })
  localStorage.setItem('authToken', resp.data.token);
  api.defaults.headers.common.authorization = `Bearer ${resp.data.token}`
  return resp.data.user
}

export const verifyUser = async () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    api.defaults.headers.common.authorization = `Bearer ${token}`
    const resp = await api.get('/auth/verify');
    return resp.data
  }
  return false
}

export const createTeacher = async (data) => {
  const resp = await api.post('/teachers', { teacher: data })
  return resp.data
}

export const readAllTeachers = async () => {
  const resp = await api.get('/teachers')
  return resp.data
}

export const updateTeacher = async (id, data) => {
  const resp = await api.put(`/teachers/${id}`, { teacher: data })
  return resp.data
}

export const destroyTeacher = async (id) => {
  const resp = await api.delete(`/teachers/${id}`)
  return resp.data
}
